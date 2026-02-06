# CSV Import

By scripting imports from CSV files, studios can:

* Create or update users in bulk
* Populate assets and task lists programmatically
* Reproduce consistent production structures across shows or seasons
* Safely re-run imports without duplicating data

CSV files are a practical interchange format because they are easy for production teams to edit and straightforward to parse programmatically.

## Supported Data Types

Any production entity supported by the Kitsu API can be imported via scripting, including:

* Artists (users)
* Assets
* Tasks
* Sequences and shots
* Episodes and productions

A full list of available entities and endpoints is available in [the OpenAPI specification document](https://api-docs.kitsu.cloud/).

While the Kitsu UI supports basic spreadsheet imports, using Gazu enables more advanced workflows such as data validation, conditional creation, synchronization with external tools, and idempotent imports.

## CSV Format Example

This guide assumes an **artists CSV** with the following columns:

| Column Name | Description                                 |
| ----------- | ------------------------------------------- |
| email       | Unique user identifier                      |
| first_name  | Artist first name                           |
| last_name   | Artist last name                            |
| role        | Artist role (optional, can be mapped later) |

Example:

```csv
email,first_name,last_name,role
jane.doe@example.com,Jane,Doe,Animator
john.smith@example.com,John,Smith,Supervisor
```

## 1. Load and Parse CSV Data

The first step is to convert the CSV file into a structured Python object suitable for API consumption.

```py
def load_csv(file_path: Path) -> pd.DataFrame:
    """Load a CSV file into a pandas DataFrame."""
    return pd.read_csv(file_path)


def parse_artists(df: pd.DataFrame) -> List[Dict]:
    """
    Expected columns:
        - email
        - first_name
        - last_name
        - role
    """
    return df.to_dict(orient="records")
```

This example can be reused for assets, tasks, or shots by changing the expected columns.

## 2. Authenticate with Kitsu

Before interacting with the API, authenticate against your Kitsu instance.

```py
gazu.set_host("http://localhost/api")
user = gazu.log_in("admin@example.com", "mysecretpassword")
```

* Use a dedicated automation or pipeline account.
* Avoid embedding credentials directly in scripts; [use environment variables](guides/authentication#secret-management) in production.
* Ensure the account has permissions to create or modify the relevant entities.

## 3. Import Artists into Kitsu

The following function creates artists in Kitsu if they do not already exist.

```py
def upload_artists(artists: List[Dict]):
    """
    Create artists if they do not already exist.
    """
    existing_users = {
        user["email"]: user
        for user in gazu.person.all_persons()
    }

    for artist in artists:
        if artist["email"] in existing_users:
            print(f"Artist exists: {artist['email']}")
            continue

        gazu.person.new_person(
            artist["first_name"],
            artist["last_name"],
            artist["email"],
        )
        print(f"Created artist: {artist['email']}")
```

This approach makes the import **idempotent**, allowing the script to be re-run safely as the CSV changes over time.

## 4. Script Entry Point

The following example ties together authentication, CSV parsing, and artist creation.

```py
if __name__ == "__main__":
    gazu.set_host("http://localhost/api")
    user = gazu.log_in("admin@example.com", "mysecretpassword")

    artists_df = load_csv(Path("artists.csv"))
    artists = parse_artists(artists_df)

    upload_artists(artists)
```

## Example Repository

A complete, working example is available here:
[https://github.com/cgwire/blog-tutorials/tree/main/import-spreadsheet-to-kitsu](https://github.com/cgwire/blog-tutorials/tree/main/import-spreadsheet-to-kitsu)
