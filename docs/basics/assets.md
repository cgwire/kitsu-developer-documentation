* Assets (constituants of a shot scene)
    * name
    * code: Utility field for the pipeline to identify the asset
    * description: Asset Brief
    * canceled: True if the asset has been delete one time.
    * project\_id: Project ID
    * entity\_type\_id: Asset type ID
    * source\_id: Field uset to set the episode\_id
    * preview\_file\_id: ID of preview file used as thumbnail
    * data: Free JSON field to add metadata
    * shotgun\_id: Used for synchronization with a Shotgun instance

* Asset instances (asset instance are instances of an asset in a layout scene)
    * asset\_id: Instantiated asset
    * number
    * name (try to not use this field)
    * description
    * active: True if 
    * data: Free JSON field to add metadata
    * scene\_id: target scene
    * target\_asset\_id: Use when instantiating an asset in an asset is required.

* Asset types
    * name

* Metadata
    * project\_id: project for which metadata are added
    * entity\_type: 'Asset' or 'Shot'
    * name: Field name for GUI
    * field\_name: Technical field name
    * choices: Array of string that represents the available values for this metada (this metatada is considered as a free field if this array is empty).


## Deal with Assets 

Retrieve all assets for a given project, shot, or asset type:

```python
assets = gazu.asset.all_assets_for_project(project_dict)
assets = gazu.asset.all_assets_for_shot(shot_dict)
assets = gazu.asset.all_assets_for_project_and_type(project_dict, asset_type_dict)
```

Retrieve all asset types:

```python
asset_types = gazu.asset.all_asset_types()
asset_types = gazu.asset.all_asset_types_for_project(project_dict) 
asset_types = gazu.asset.all_asset_types_for_shot(shot_dict) # casted in given shot
```

Get a given asset:

```python
asset = gazu.asset.get_asset(asset_id)
asset = gazu.asset.get_asset_by_name(project_dict, asset_name)
```

Get a given asset type:

```python
asset_type = gazu.asset.get_asset_type(asset_type_id)
asset_type = gazu.asset.get_asset_type_by_name(asset_type_name)
```


Create/update/delete an asset:

```python
asset = gazu.asset.new_asset(
    project_dict, 
    asset_type_dict, 
    "My new asset",
    "My asset description"
)

asset = gazu.asset.update_asset(new_values_dict)
gazu.asset.remove_asset(asset)
```

Create/update/delete an asset type:

```python
asset_type = gazu.asset.new_asset_type("my new asset_type")
asset_type = gazu.asset.update_asset_type(new_values_dict)
gazu.asset.remove_asset_type(asset)
```

Asset instance helpers:

```python
asset_instance = get_asset_instance(asset_instance_id)
asset_instances = all_asset_instances_for_asset(asset_dict)
asset_instances = all_asset_instances_for_shot(shot_dict)
```
