# Lightweight Directory Access Protocol (LDAP)

Authentication can be managed through a LDAP (or Active Directory) server. It allows you to start using Kitsu directly with the accounts listed in your LDAP.

## Activate LDAP

To activate LDAP, you must set the *AUTH\_STRATEGY* environment variable (in /etc/zou/zou.env) with
the following value:

```
AUTH_STRATEGY=auth_remote_ldap
```

*NB: If you are using Active directory you must set the `LDAP_IS_AD` flag to true.* 


## Required environment variables

Once this authentication scheme selected, you must set the following variables:

* `LDAP_HOST` (default: "127.0.0.1"): the IP address of your LDAP server.
* `LDAP_PORT` (default: "389"): the listening port of your LDAP server.
* `LDAP_BASE_DN` (default: "CN=Users,DC=studio,DC=local"): the base domain of
  your LDAP configuration.
* `LDAP_DOMAIN` (default: "studio.local"): the domain used for your LDAP
  authentication.
* `LDAP_FALLBACK` (default: "False"): Set to True if you want to allow admins
  to fallback on default auth strategy when the LDAP server is down.
* `LDAP_IS_AD` (default: "False"): Set to True if you use LDAP with active directory.

Example:

```
LDAP_HOST=192.168.1.10
LDAP_PORT=389
LDAP_BASE_DN=CN=Users,DC=mystudio,DC=local
LDAP_DOMAIN=mystudio.com
LDAP_FALLBACK=True
```


## Login by search then bind

By default, Zou builds the DN of the user from the login and `LDAP_BASE_DN`.
Thus all the users must be directly under `LDAP_BASE_DN`, and their account
must exist in Kitsu before their first login (see the synchronization below).

Set `LDAP_SEARCH_BIND` to True to change this behavior. Zou then uses a
service account to find the user, and checks the password with a bind as this
user:

* The user can be anywhere under `LDAP_BASE_DN`, sub-OUs included.
* The user can log in with a login or an email address (or a UPN with Active
  Directory).
* The Kitsu account is created at the first login. It is updated from the
  directory at each login.
* If `LDAP_GROUP` is set, only the members of this group can log in.
* A user who is removed from the directory, disabled, out of `LDAP_GROUP` or
  listed in `LDAP_EXCLUDED_ACCOUNTS` cannot log in. The Kitsu account is
  deactivated at this login attempt.
* A Kitsu account that was not created from the LDAP is never linked to a
  directory user.
* The accounts listed in `PROTECTED_ACCOUNTS` keep the default login.

This mode requires the service account in the environment of the Zou server
(/etc/zou/zou.env), not only for the synchronization command:

```
LDAP_SEARCH_BIND=True
LDAP_USER=myserviceaccount
LDAP_PASSWORD=myservicepassword
```

An account is deactivated only when somebody tries to log in with it. Keep
the synchronization below on a schedule to deactivate the users who left and
never come back.


## User list synchronization

You will have to synchronize the user list with users from the LDAP. A good
option is to handle it via a Python script. But, to makes things simpler, 
we added a command in `zou` binary to do it for you. 
It's a one way sync. We consider that Zou should not alter your LDAP user list.

This command requires additional environment variables:

* `LDAP_USER`: Username of a LDAP user that can lists all LDAP users.
* `LDAP_PASSWORD`: Password of a LDAP user that can lists all LDAP users.
* `EMAIL_DOMAIN` (default: "studio.local"): User email will be built with username + @ + email domain.
* `LDAP_EXCLUDED_ACCOUNTS`: Set the list of people that should not be created
  in Kitsu API (Zou).

The synchronization stops before it changes any account when `LDAP_GROUP` is
not found in the directory, or when the search returns no user. Both cases
usually come from a wrong `LDAP_GROUP` or `LDAP_BASE_DN`, and they would
deactivate every LDAP account.

Example:

```
LC_ALL=C.UTF-8 \
LANG=C.UTF-8 \
DB_HOST=yourdbhost \
LDAP_HOST=192.168.1.10 \
LDAP_PORT=389 \
LDAP_BASE_DN=CN=Users,DC=mystudio,DC=local \
LDAP_DOMAIN=mystudio.com \
LDAP_USER=myusername \
LDAP_PASSWORD=myuserpassword \
EMAIL_DOMAIN=mystudio.com \
LDAP_EXCLUDED_ACCOUNTS=Administrator,TestAccount \
zou sync-with-ldap-server
```

## Note about Kitsu

When LDAP is activated, it is not possible anymore to change following user
information through the Kitsu web UI:

* email
* first name
* last name
* avatar
