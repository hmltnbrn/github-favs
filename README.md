# GitHub Starred Repos

## Running

1. Create a **.env** file in the `server` directory with the following values (there is a **.env.example** file for reference)

   ```
   GITHUB_TOKEN=
   GITHUB_USERNAME=
   ```

2. Run the below command to start all the Docker services (this includes `reposerver`)

   ```
   docker compose up -d
   ```

3. Go to [localhost:3000](http://localhost:3000)

4. Run the below command to shut down Docker services

   ```
   docker compose down
   ```

## Notes

1. My biggest assumption was that it was all supposed to work with a single GitHub user. Adding a username field to the frontend and allowing multiple users wouldn't be difficult to accomplish.

2. Material-UI is used for most UI elements (I did do some SCSS myself). It integrates its Autocomplete component with debounce to get starred GitHub repos. Other elements included are Card, Button, AppBar, and Snackbar. I wanted to use these in order to cut down on making too many of my own components that would require upkeep.

3. In order to do most of the queries and mutations with reposerver I used react-query. I could have just done useCallback and Axios, but I wanted to integrate Suspense (doesn't work out of the box with Axios or fetch) and easy refetching. Error handling is rudimentary but it should work with either error boundaries or popup snackbars where necessary.

4. The only reposerver internal error I could find was if you try to add a repo that's already in there. I check for that and also check for the 10 maximum stored repos. Those errors are shown with snackbars. Anything else should fall back to error boundaries.

5. The sort dropdown is buggy when the suspense fires. I tried different remedies, but nothing was a perfect solution. Seems to be an issue with Material UI. It loads so quickly on Docker that the suspense isn't really necessary (and does look a bit weird and jumpy) but I thought it was fun to do that for this.

6. There's a couple tests in there but it's nothing crazy.

7. I didn't do a production build. It runs with `yarn start` only on the client.

8. I did all of this on Windows with WSL. It works on my end and hopefully it does on yours too. Contact me if there's an issue. Worst case scenario everything can be run separately.

9. Tested with Chrome and Firefox. Works on mobile.
