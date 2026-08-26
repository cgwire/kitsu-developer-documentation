# Casting (Breakdown)

The casting of a shot, an episode or an asset is the list of assets it is made
of: the characters, props and environments of a shot, or the parts of a
set. Kitsu edits it on the Breakdown page; through the API it is a list of
entity links, each with a number of occurences and a label.

## Reading a casting

```python
gazu.casting.get_shot_casting(shot)
# [{"asset_id": "...", "asset_name": "Bob", "asset_type_name": "Character",
#   "nb_occurences": 2, "label": "animate", ...}]

gazu.casting.get_episode_casting(episode)
gazu.casting.get_asset_casting(asset)      # set dressing: the parts of an asset
gazu.casting.get_sequence_casting(sequence)  # keyed by shot ID
gazu.casting.get_episodes_casting(project)   # keyed by episode ID

gazu.casting.get_asset_cast_in(asset)  # the shots, episodes and assets using it
```

## Casting one asset

`cast_asset` sets how one asset is cast in one or several entities. The
other assets of each entity are left as they are, so several people (or a
script and the Kitsu UI) can edit the breakdown at once without erasing
each other's work.

```python
gazu.casting.cast_asset(project, [shot_1, shot_2], asset, nb_occurences=2, label="animate")
gazu.casting.cast_asset(project, shot_1, asset, label="fixed")  # keeps the count
gazu.casting.uncast_asset(project, [shot_1, shot_2], asset)
```

- `nb_occurences` omitted keeps the current count (1 on a new link), `0`
  removes the asset;
- `label` omitted keeps the current label;
- the entities can be shots, episodes or assets of the project, the asset can
  be a shared asset from another project.

The call needs manager access to the project. It returns the new casting of
each entity, keyed by entity ID.

## Replacing a whole casting

`update_shot_casting`, `update_asset_casting` and `update_episode_casting`
replace the casting with the list you give:

```python
gazu.casting.update_shot_casting(project, shot, [
    {"asset_id": asset["id"], "nb_occurences": 2, "label": "animate"},
])
```

Anything missing from the list is removed. Fine for a one-shot import,
risky on a casting others are editing: prefer `cast_asset` for changes.

## Shots and episodes

Two rules link the casting of a shot to the casting of its episode:

- casting an asset in a shot casts it in the parent episode too; it leaves
  the episode once no shot of the episode uses it anymore;
- an asset cast from the episode side stays until removed from the episode,
  and removing it there removes it from every shot of the episode.

The episode links created by the first rule carry `data: {"auto": true}` on
the [EntityLink](/references/data-models#entitylink) model; the ones set from
the episode side have no flag.

## Following changes

Every change emits an event carrying the diff, so a listener needs no
snapshot of its own (see [Event Listeners](/guides/event-listeners)):

| Event | Payload |
|---|---|
| `shot:casting-update` | `shot_id`, `nb_entities_out`, `added_asset_ids`, `removed_asset_ids` |
| `episode:casting-update` | `episode_id`, `nb_entities_out`, `added_asset_ids`, `removed_asset_ids` |
| `asset:casting-update` | `asset_id`, `nb_entities_out`, `added_asset_ids`, `removed_asset_ids` |
