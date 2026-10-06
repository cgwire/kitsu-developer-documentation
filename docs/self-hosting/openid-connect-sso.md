# OpenID Connect (OIDC) SSO

Authentication can be delegated to an OpenID Connect identity provider
(Keycloak, Microsoft Entra ID / Azure AD, Okta, Google, ...). When enabled, a
"Login with &lt;provider&gt;" button appears on the Kitsu login page. Users are
redirected to the provider and, on return, the Kitsu account bound to their
identity is signed in (or created on first login).

## Activate OIDC

OIDC is enabled with its own flag, independently of `AUTH_STRATEGY`. Set the
following variables (in `/etc/zou/zou.env`):

```
OIDC_ENABLED=true
OIDC_IDP_NAME=Keycloak
OIDC_DISCOVERY_URL=https://keycloak.example.com/realms/myrealm/.well-known/openid-configuration
OIDC_CLIENT_ID=kitsu
OIDC_CLIENT_SECRET=<secret from the provider's client>
```

`OIDC_IDP_NAME` is the label shown on the login button. `OIDC_DISCOVERY_URL`
must point at the provider's OpenID configuration document (it ends with
`/.well-known/openid-configuration`); Zou reads the endpoints, signing keys and
supported features from it.

Register this redirect URI on the provider's client:

```
<DOMAIN_PROTOCOL>://<DOMAIN_NAME>/api/auth/oidc/callback
```

For example `https://kitsu.example.com/api/auth/oidc/callback`. Authentication
uses the authorization-code flow with PKCE.

::: info
OIDC relies on Flask's signed-cookie session to carry the `state`, `nonce` and
PKCE values between the login redirect and the callback, so `SECRET_KEY` must be
set: it already is in any standard deployment.
:::

## Required environment variables

* `OIDC_ENABLED` (default: "false"): set to True to enable OIDC SSO.
* `OIDC_IDP_NAME` (default: ""): display name shown on the login button.
* `OIDC_DISCOVERY_URL` (default: ""): provider OpenID configuration URL.
* `OIDC_CLIENT_ID` (default: ""): OAuth client identifier registered with the
  provider.
* `OIDC_CLIENT_SECRET` (default: ""): OAuth client secret.

## Optional environment variables

* `OIDC_SCOPES` (default: "openid email profile"): space-separated scopes to
  request.
* `OIDC_EMAIL_CLAIM` (default: "email"): claim used as the account email.
* `OIDC_GIVEN_NAME_CLAIM` (default: "given_name"): claim used for the first
  name.
* `OIDC_FAMILY_NAME_CLAIM` (default: "family_name"): claim used for the last
  name.
* `OIDC_REQUIRE_EMAIL_VERIFIED` (default: "True"): when True, the provider must
  assert `email_verified == true`; logins with an absent or false claim are
  rejected. Set to False only for providers that do not emit the claim and
  whose emails are otherwise trusted.
* `OIDC_SKIP_2FA` (default: "False"): when True, OIDC sessions skip Kitsu's 2FA
  setup gate (trust the provider for MFA). When False, `ENFORCE_2FA` applies as
  usual.

The standard OIDC claim names work out of the box. Override the `OIDC_*_CLAIM`
variables only for providers that use non-standard names.

## Account binding and provisioning

An email is mutable and set by the administrators of the identity provider, so
it does not prove who is signing in. Zou identifies an account by the issuer
and subject of the ID token (the `iss` and `sub` claims), which never change.

* **First login**: Zou looks up the Kitsu account whose email matches the
  `OIDC_EMAIL_CLAIM` value and binds it to the identity. An account created
  beforehand in Kitsu is therefore picked up on its first OIDC login.
* **Next logins**: the account is found by its identity. The email is no longer
  used, so renaming a user at the provider keeps them on the same Kitsu
  account. The email stored in Kitsu is not changed by the login.
* **Provisioning**: when no account matches, one is created with the `user`
  role and bound to the identity. Anyone who can authenticate with the
  configured provider therefore gets a Kitsu account; scope membership in your
  identity provider accordingly.
* **Email verification**: with `OIDC_REQUIRE_EMAIL_VERIFIED` enabled (the
  default), an explicit `email_verified == true` claim is required on the first
  login, before binding or provisioning.
* **Names**: first and last names are refreshed from the provider's claims on
  each login.

### Refused logins

A login is refused with a 400 error in two cases:

* The email belongs to an account already bound to **another identity** of the
  same provider. This is what happens when an address is given to somebody
  else: the newcomer does not inherit the previous account.
* The email belongs to an account listed in `PROTECTED_ACCOUNTS`. These
  accounts are never bound through their email.

### Unbind an account

To let another identity take over an account (a recycled address, a user
recreated at the provider), an administrator clears the stored identity. The
next OIDC login with the matching email binds the account again.

::: code-group
```python [Python]
gazu.raw.put(
    f"data/persons/{person_id}",
    {"oidc_issuer": None, "oidc_subject": None},
)
```
```bash [cURL]
curl \
 --request PUT "https://kitsu.example.com/api/data/persons/$PERSON_ID" \
 --header "Authorization: Bearer $TOKEN" \
 --header "Content-Type: application/json" \
 --data '{"oidc_issuer": null, "oidc_subject": null}'
```
:::

The same route binds a protected account explicitly: set `oidc_issuer` to the
provider's issuer URL and `oidc_subject` to the user's `sub`.

### Upgrade and provider change

* **Existing deployments**: nothing to do. Each account is bound at its next
  login, through its email.
* **New provider**: when `OIDC_DISCOVERY_URL` points at another issuer,
  accounts are bound again through their email at their next login.

## Provider notes

The same configuration shape works for Keycloak, Microsoft Entra ID / Azure AD,
Okta and Google: point `OIDC_DISCOVERY_URL` at the provider's discovery
document.

Some providers (notably Azure AD / Entra ID) omit `given_name` / `family_name`
from the ID token and expose them only on the userinfo endpoint. Zou fetches the
userinfo endpoint as a fallback when the ID token carries no name claims, so
accounts are still created with names.
