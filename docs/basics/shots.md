* Shots
    * name
    * code: Utility field for the pipeline to identify the asset
    * description: Shot Brief
    * canceled: True if the asset has been delete one time.
    * project\_id: Project ID
    * parent\_id: Episode ID
    * entity\_type\_id: Shot type ID
    * source\_id: Field uset to set the episode\_id
    * preview\_file\_id: ID of preview file used as thumbnail
    * data: Free JSON field to add metadata
    * shotgun\_id: Used for synchronization with a Shotgun instance

* Metadata
    * project\_id: project for which metadata are added
    * entity\_type: 'Asset' or 'Shot'
    * name: Field name for GUI
    * field\_name: Technical field name
    * choices: Array of string that represents the available values for this metada (this metatada is considered as a free field if this array is empty).

## Deal with Shots 

Retrieve all shots for a given project or sequence:

```python
shots = gazu.shot.all_shots_for_project(project_dict)
shots = gazu.shot.all_shots_for_sequence(sequence_dict)
```

Retrieve all sequences for a given project or episode.

```python
sequences = gazu.shot.all_sequences_for_project(project_id)
sequences = gazu.shot.all_sequences_for_episode(episode_dict)
```

Retrieve all episodes for a given project:

```python
episodes = gazu.shot.all_episodes_for_project(project_dict)
```

Retrieve given shot:

```python
shot = gazu.shot.get_shot(shot_id)
shot = gazu.shot.get_shot_by_name(sequence_dict, "SH01")
```

Retrieve the given sequence:

```python
sequence = gazu.shot.get_sequence(shot_id)
sequence = gazu.shot.get_sequence_by_name(project_dict, "SE01", episode=episode_dict)
```

Retrieve given episode:

```python
episode = gazu.shot.get_episode(shot_id)
episode = gazu.shot.get_episode_by_name(project_dict, "SE01")
```

Create shot, sequence, and episode:

```python
shot = gazu.shot.new_shot(
    project_dict, 
    sequence_dict, 
    "SH01", 
    frame_in=10, 
    frame_out=20, 
    data={"extra_data": "value"}
)
sequence = gazu.shot.new_sequence(project_dict, episode, name)
episode = gazu.shot.new_episode(project_dict, "SH01")
```

Update shots:

```python
shot = gazu.shot.update_shot(shot, data={})
```

Asset instance helpers:

```python
asset_instance = gazu.shot.new_shot_asset_instance(shot_dict, asset_dict)
asset_instances = gazu.shot.all_asset_instances_for_shot(shot_dict)
```
