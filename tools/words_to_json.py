import json

def words_to_list(tags_glop):
    already_existing_count = 0
    existing_tag_list = []

    with open("./static/json/suggestions_list.json", "r") as f:
        existing_tag_list = json.load(f)  # Load existing tags from JSON file

    # Check each tag in tags_glop if it already exists in the JSON file
    tags_glop_list = tags_glop.split("\n")
    for tag in tags_glop_list:
        if tag in existing_tag_list:
            already_existing_count += 1
        else:
            existing_tag_list.append(tag)  # Add new tags from input

    existing_tag_list = list(set([item for item in existing_tag_list if item != ""]))  # Remove duplicates and empty items

    with open("./static/json/suggestions_list.json", "w") as f:
        json.dump(sorted(existing_tag_list), f)  # Write updated list to JSON file

    print(f"Finished!: Already existing items: {already_existing_count}/{len(tags_glop_list)}")

words_to_list("""<insert words here>""")
