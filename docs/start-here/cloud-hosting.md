# Cloud Hosting

## 1. Sign up for a demo

The fastest way to get started with Kitsu is to [sign up for a demo](https://account.cg-wire.com/signup).

Alternatively, if you don't need a production-ready environment, you can [have a look at the Docker installation](/start-here/docker) for a quick development setup.

## 2. Build With The Kitsu API

If your version of Kitsu is hosted and maintained by CGWire, you don't have anything to install. Simply connect to the URL provided to you to start using Kitsu.

::: code-group
```curl
curl \
 --request POST 'https://zou-server-url/api/auth/login' \
 --header "Content-Type: application/json" \
 --data '{"email":"admin@example.com","password":"mysecretpassword","totp":123456,"email_otp":123456,"fido_authentication_response":{},"recovery_code":"ABCD-EFGH-IJKL-MNOP"}'
```
```py
import gazu

gazu.set_host("https://zou-server-url/api")
gazu.log_in("user@yourdomain.com", "password")
```
:::

## Next Step

* Learn about [alternative authentication strategies](/guides/authentication)
* Learn to [setup a new production](/guides/production-management)
