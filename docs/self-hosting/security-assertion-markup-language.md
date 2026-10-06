# Security Assertion Markup Language (SAML)

Authentication can be delegated to a SAML 2.0 identity provider (Keycloak,
Microsoft Entra ID / Azure AD, Okta, OneLogin, ...). When enabled, a "Login
with &lt;provider&gt;" button appears on the Kitsu login page. Users are
redirected to the provider and, on return, a matching Kitsu account is signed
in (or created on first login).

## Activate SAML

SAML is enabled with its own flag, independently of `AUTH_STRATEGY`. Set the
following variables (in `/etc/zou/zou.env`):

```
SAML_ENABLED=true
SAML_IDP_NAME=Keycloak
SAML_METADATA_URL=https://keycloak.example.com/realms/myrealm/protocol/saml/descriptor
```

`SAML_IDP_NAME` is the label shown on the login button. `SAML_METADATA_URL`
must point at your identity provider's SAML metadata document; Zou downloads it
at startup to read the provider's endpoints and signing certificates.

## Required environment variables

* `SAML_ENABLED` (default: "False"): set to True to enable SAML SSO.
* `SAML_IDP_NAME` (default: ""): display name shown on the login button.
* `SAML_METADATA_URL` (default: ""): identity provider SAML metadata URL.

## Optional environment variables

* `SAML_SUBJECT_ATTRIBUTE` (default: ""): assertion attribute holding the
  provider's stable user id. When set, accounts are bound to it instead of
  being matched by email on every login. See
  [Account binding](#account-binding-and-provisioning).
* `SAML_SKIP_2FA` (default: "False"): when True, SAML sessions skip Kitsu's 2FA
  setup gate (trust the provider for MFA). When False, `ENFORCE_2FA` applies as
  usual.

## Service provider configuration

When registering Kitsu (the service provider) with your identity provider, use:

* **Entity ID**: `<DOMAIN_PROTOCOL>://<DOMAIN_NAME>/api/auth/saml/login`
* **Assertion Consumer Service (ACS) URL**:
  `<DOMAIN_PROTOCOL>://<DOMAIN_NAME>/api/auth/saml/sso`

For example, with `https://kitsu.example.com`, the ACS URL is
`https://kitsu.example.com/api/auth/saml/sso`.

Zou's service provider expects signed assertions (`want_assertions_signed`) and
does not sign its own authentication requests, so no service-provider signing
certificate needs to be configured on the identity provider side.

## Attribute mapping

The user email is taken from the assertion's `NameID` (subject). The following
optional attributes are read from the assertion and stored on the Kitsu account
when present:

* `first_name`
* `last_name`
* `phone`
* `departments`
* `studio_id`
* `country`

Map your identity provider's attributes to these names so profiles are populated
on login.

The attribute named by `SAML_SUBJECT_ATTRIBUTE`, when set, is read too. It must
carry a single value that never changes for a user and is never given to
another one: an LDAP `uid`, an Active Directory `objectGUID`, the provider's
internal user id. Do not use the email.

## Account binding and provisioning

An email is mutable and set by the administrators of the identity provider, so
it does not prove who is signing in. Unlike OIDC, SAML has no standard stable
identifier: Zou needs `SAML_SUBJECT_ATTRIBUTE` to know which attribute carries
one.

::: warning
Without `SAML_SUBJECT_ATTRIBUTE`, the account is looked up by the `NameID`
email on every login. Whoever can set an email at the identity provider can
sign in to the Kitsu account holding it, and a user whose email changes gets a
second account. Set the variable whenever your provider can send a stable
identifier.
:::

With `SAML_SUBJECT_ATTRIBUTE` set, Zou identifies an account by the entity id
of the identity provider and the value of that attribute:

* **First login**: Zou looks up the Kitsu account whose email matches the
  assertion's `NameID` and binds it to the identity. An account created
  beforehand in Kitsu is therefore picked up on its first SAML login.
* **Next logins**: the account is found by its identity. The email is no longer
  used, so renaming a user at the provider keeps them on the same Kitsu
  account. The email stored in Kitsu is not changed by the login.
* **Provisioning**: when no account matches, one is created with the `user`
  role and bound to the identity. Anyone who can authenticate with the
  configured provider therefore gets a Kitsu account; scope membership in your
  identity provider accordingly.
* **Attributes**: mapped attributes are refreshed from the assertion on each
  login.

### Refused logins

With `SAML_SUBJECT_ATTRIBUTE` set, a login is refused with a 400 error in three
cases:

* The assertion does not carry the attribute, or carries several values.
* The email belongs to an account already bound to **another identity** of the
  same provider. This is what happens when an address is given to somebody
  else: the newcomer does not inherit the previous account.
* The email belongs to an account listed in `PROTECTED_ACCOUNTS`. These
  accounts are never bound through their email.

### Unbind an account

To let another identity take over an account (a recycled address, a user
recreated at the provider), an administrator clears the stored identity. The
next SAML login with the matching email binds the account again.

::: code-group
```python [Python]
gazu.raw.put(
    f"data/persons/{person_id}",
    {"saml_issuer": None, "saml_subject": None},
)
```
```bash [cURL]
curl \
 --request PUT "https://kitsu.example.com/api/data/persons/$PERSON_ID" \
 --header "Authorization: Bearer $TOKEN" \
 --header "Content-Type: application/json" \
 --data '{"saml_issuer": null, "saml_subject": null}'
```
:::

The same route binds a protected account explicitly: set `saml_issuer` to the
entity id of the identity provider and `saml_subject` to the user's attribute
value.

### Enable the binding on an existing deployment

Make the provider send the attribute first, then set `SAML_SUBJECT_ATTRIBUTE`
and restart Zou. Each account is bound at its next login, through its email.
The SAML identity is stored apart from the OIDC one, so an account may use
both.

## Note about Kitsu

When a SAML user is created, the email, first name and last name come from the
identity provider's assertion. The names are refreshed on each login, the email
is not.
