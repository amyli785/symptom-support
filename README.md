# Symptom Support

Team AGIS's project for 6.1040.

## API Routes


### USER ROUTES

#### `GET /api/users/session/`
- Gets the signed in user.

**Returns**
- A success message
- An object with the signed in User

#### `POST /api/users/session/`
- Create a new session for a user (i.e. sign in a user).

**Body**
- `username` _{string}_ - the username of the account to sign in
- `password` _{string}_ - the password of the account to sign in

**Returns**
- A success message
- An object with the signed in User

**Throws**
- `403` If the user is already logged in
- `400` If username is not provided
- `404` If username or password is missing or not in the correct format
- `401` If the login credentials are invalid

#### `DELETE /api/users/session/`
- Delete the signed in user's session (i.e. sign out the user).

**Returns**
- A success message

**Throws**
- `403` If the user is not logged in

#### `POST /api/users/`
- Create a new user

**Body**
- `username` _{string}_ - the username of the account to create
- `password` _{string}_ - the password of the account to create
- `displayName` _{string}_ - the displayName of the account to create

**Returns**
- A success message
- An object with the created user

**Throws**
- `403` If there is a user that is already logged in
- `409` If the username is already taken
- `400` If the username, password, or display name is not in the correct format

#### `PATCH /api/users/`
- Update an existing user's information

**Body**
- `username` _{string}_ - the new username of the account to update
- `password` _{string}_ - the new password of the account to update
- `displayName` _{string}_ - the new displayName of the account to update

**Returns**
- A success message
- An object with the updated User

**Throws**
- `403` If there is a user that is already logged in
- `409` If the username is already taken
- `400` If the username, password, or display name is not in the correct format

#### `DELETE /api/users/`
- Delete a user.

**Returns**
- A success message

**Throws**
- `403` If the user is not logged in

### ENTRY ROUTES

#### `GET /api/entries?username=username`
 - Get all entries owned by the username.

**Returns**
- An array with the entries found.

**Throws**
- `403` If user not logged in
- `400` If `username` is empty
- `404` If no user with `username` exists
- `403` If user lacks permissions to view entries about the user with username `username`

#### `GET /api/entries/:entryId`
- Get the entry with the entry id.

**Returns**
- The entry with the entry id.

**Throws**
- `403` If user not logged in
- `400` If `entryId` is empty or not in the correct format
- `404` If no entry with `entryId` exists
- `403` If user lacks permissions to view entry with id `entryId`

#### `POST /api/entries/`
- Add a new entry with author as the logged in user.

**Body**
- `owner` _{string}_ - The username of the owner of the entry
- `dateStarted` _{string}_ - The date started of the content of the entry
- `dateEnded` _{string}_ - The date ended of the content of the entry
- `symptoms` _{Array<SymptomDetails>}_ - The symptoms of the entry
- `medications` _{Array<MedicationDetails>}_ - The medications of the entry
- `mood` _{number}_ - The mood of the entry
- `notes` _{string}_ - The notes of the entry

**Returns**
- A success message
- An object with the created entry

**Throws**
- `403` If the user is not logged in
- `400` If `owner` is empty
- `404` If no user with username `owner` exists
- `403` If user lacks permissions to create an entry for user with username `owner`
- `400` If `dateStarted` is empty or not a valid date or in the past
- `400` If `dateEnded` is non-empty and not a valid date or in the past or before `dateStarted`
- `400` If `symptoms` is not an array or contains an element that is not properly formatted (non-empty name, valid symptom unit and measurement combination (if provided))
- `400` If `medications` is not an array or contains an element that is not properly formatted (non-empty name, non-empty unit, number dosage greater than 0)
- `400` If `mood` is non-empty and not in the correct format (integer between 1 and 10, inclusive)

#### `PATCH /api/entries/:entryId`
- Update an entry with id `entryId`.

**Body**
- `dateStarted` _{string}_ - The date started of the content of the entry
- `dateEnded` _{string}_ - The date ended of the content of the entry
- `symptoms` _{Array<SymptomDetails>}_ - The symptoms of the entry
- `medications` _{Array<MedicationDetails>}_ - The medications of the entry
- `mood` _{number}_ - The mood of the entry
- `notes` _{string}_ - The notes of the entry

**Returns**
- A success message
- An object with the updated entry

**Throws**
- `403` If the user is not logged in
- `400` If `entryId` is empty or not in the correct format
- `404` If no entry with `entryId` exists
- `403` If user lacks permissions to manage entry with id `entryId`
- `400` If `dateStarted` is empty or not a valid date or in the past
- `400` If `dateEnded` is non-empty and not a valid date or in the past or before `dateStarted`
- `400` If `symptoms` is not an array or contains an element that is not properly formatted (non-empty name, valid symptom unit and measurement combination (if provided))
- `400` If `medications` is not an array or contains an element that is not properly formatted (non-empty name, non-empty unit, number dosage greater than 0)
- `400` If `mood` is non-empty and not in the correct format (integer between 1 and 10, inclusive)

#### `DELETE /api/entries/:entryId`
- Delete the entry with given entry id.

**Returns**
- A success message

**Throws**
- `403` If the user is not logged in
- `400` If `entryId` is empty or not in the correct format
- `404` If no entry with `entryId` exists
- `403` If user lacks permissions to manage entry with id `entryId`


### SUPPORT ROUTES

#### `POST /api/supports`
- Add user as supporter.

**Returns**
- A success message
- The created support object

**Throws**
- `403` If the user is not logged in
- `400` If username is not provided
- `404` If user with username does not exist
- `409` If the username belongs to the logged in user
- `409` If support relation already exists
- `400` If the permission level isn't provided
- `400` If the permission level isn't valid (i.e. "creator", "viewer", or "manager")

#### `DELETE /api/supports/supporter/:username`
- Remove user as a supporter.

**Returns**
- A success message

**Throws**
- `403` If the user is not logged in
- `400` If username is not provided
- `404` If user with username does not exist
- `409` If the username belongs to the logged in user
- `404` If support relationship does not exist

#### `DELETE /api/supports/supported/:username`
- Remove a user from the logged in user's supported list.

**Returns**
- A success message

**Throws**
- `403` If the user is not logged in
- `400` If username is not provided
- `404` If user with username does not exist
- `409` If username belongs to logged in user
- `404` If the support relationship does not exist

#### `GET /api/supports/supported`
- Get all of user's supported.

**Returns**
- An array containing the relevant support objects

**Throws**
- `403` If user not logged in

#### `GET /api/supports/supported?inviteStatus=inviteStatus`
- Get all of the user’s supported whose invite status matches inviteStatus

**Returns**
- An array containing the relevant support objects

**Throws**
- `403` If user not logged in
- `400` If inviteStatus is not provided
- `400` If inviteStatus is not valid (i.e. "invited" or "accepted")

#### `GET /api/supports/supporter`
- Get all of the users that the logged in user has added as supporters.

**Returns**
- An array containing the relevant support objects

**Throws**
- `403` If user not logged in

#### `GET /api/supports/supporter?inviteStatus=inviteStatus`
- Get all of the users that the logged in user has added as supporters whose invite status matches inviteStatus

**Returns**
- An array containing the relevant support objects

**Throws**
- `403` If user not logged in
- `400` If inviteStatus is not provided
- `400` If inviteStatus is not valid (i.e. "invited" or "accepted")

#### `PATCH /api/supports/supporter/:username`
- Modify a support’s permission level

**Body**
- The new permission level

**Returns**
- The modified support object

**Throws**
- `403` if the user is not logged in
- `404` If the support relationship does not exist
- `400` If the permission level is not provided
- `400` If the permission level is not a valid option

#### `PATCH /api/supports/supported/:username`
- Modify a support’s invite status

**Body**
- The new invite status

**Returns**
- The modified support object

**Throws**
- `403` if the user is not logged in
- `404` If the support relationship does not exist
- `400` If the invite status is not provided
- `400` If the invite status is not a valid option


### FLAG ROUTES

#### `GET /api/flags?entryId=entryId`
- Get flag by entryId

**Returns**
- The flag with entryId = entryId

**Throws**
 - `403` If the user is not logged in
 - `400` If entryId not provided
 - `400` If entryId is not a valid Object ID
 - `403` If the entry with id = entryId does not exist
 - `403` If the entry with id = entryId is not viewable by the logged in user
 - `403` If the flag of entry with id = entryId does not exist

#### `GET /api/flags?username=username`
- Get all flags for owner who has username = username

**Returns**
 - The flags where owner has username = username

**Throws**
 - `403` If the user is not logged in
 - `400` If username not provided
 - `404` If the user with username does not exist
 - `403` If the logged in user does not have permission to view username's flags

#### `POST /api/flags`
- Flag an entry.

**Body**
- entryId _{string}_ - The id of the entry to be flagged

**Returns**
 - The created flag

**Throws**
 - `403` If the user is not logged in
 - `400` If entryId is not provided or not a correctly formatted Object ID
 - `404` If entry with id = entryId does not exist
 - `403` If the logged in user does not have permission to create for the entry owner
 - `409` If the flag already exists

#### `DELETE /api/flags/:entryId`
- Unflag an entry.

**Returns**
- A success message

**Throws**
 - `403` If the user is not logged in
 - `400` If entryId is not provided or is not a valid Object ID
 - `404` If entry with id = entryId does not exist
 - `403` If the logged in user does not have permission to manage the entry


### SHARE ROUTES

#### `GET /api/shares/:shareId`
- Get the share with the share id.

**Returns**
- The share with the share id

**Throws**
- `403` If user not logged in
- `400` If `shareId` is empty or not in the correct format
- `404` If no share with `shareId` exists

#### `POST /api/shares/`
- Add a new share.

**Body**
- entryIds _{Array<string>}_ - The ids of the entries of the share
- name _{string}_ - The name of the share

**Returns**
- A success message
- An object with the created share

**Throws**
- `403` If the user is not logged in
- `400` If `entryIds` is not an array or contains an element that is not a properly formatted object id
- `404` If `entryIds` contains an entryId that does not exist
- `403` If the user is not the owner of any entry in `entryIds`
- `400` If `name` is empty



