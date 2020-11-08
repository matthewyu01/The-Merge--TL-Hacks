# Merge Esports (for Liquid Hacks)

## Inspiration

We realized that players on Liquipedia who have moved on to different games had separate pages, as well as the organizations. We wanted to create an application that merges information from the various different pages into one page for each organization and player.

## What it does

Merge Esports is a web app that allows users to quickly learn about their favorite games, organizations, and players in the world of Esports. Users can search for specific teams, or browse a list of players and teams, easily filterable by games. When viewing individual organizations, users can quickly choose which team’s roster and recent matches they wish to see. On the player’s page, users are presented with their current team, as well as a timeline which shows which teams they played on and when. Our site additionally features a statistics page, which is designed to be a dashboard overview of the current Esports scene, displaying current team rankings and active player counts for each game.

## How we built it

We built our application using a traditional client/server architecture, with ReactJS on the Frontend and Python Flask on the backend. We fetch data from multiple external APIs, including Stream and Liquipedia DB, and then display this information using React components. We started our application by focusing on the list views, Esports players and organizations, in the process learning more about the Liquipedia DB API. Once we got the hang of the API, we were able to write custom filtering queries to get match and roster information for each individual team. Once we had the core functionality down, we expanded our design by incorporating different other APIs into a single statistics page, providing a unique experience to our users.

## Challenges we ran into

We spent a few hours trying to figure out how to submit requests to the Liquipedia API as we tried to learn the proper formatting of the requests. Since we designed our web app to display organization logos, and we weren’t allowed to hard link images from the Liquipedia API response, we also had to learn how to use our backend to handle the images for our frontend. Generally, we ran into some additional challenges regarding how to improve the design and layout of our app.

## Accomplishments that we’re proud of

We successfully implemented many of the features that we originally envisioned, such as transfer timelines for players, live team rankings, and team histories for organizations. We’re proud of the fact that we finished quite a lot in such a short period of time, and we feel that we did a good job with our app’s UI too.

## What we learned

Nicolas: I learned another very popular backend framework, Flask, which I enjoyed more than Django. I also got to do a lot more frontend development than I normally do, and I used some new libraries like Google Charts and Material-UI.

Alexander: I learned how to use the backend framework Flask, which I also enjoyed more than Django. I also got more experience in frontend development with using new frameworks like Material-UI.

Matthew: I learned how to use React with Material-UI and Flask, and used Javascript again after learning the basics 4 years ago.

## What's next for Merge Esports

We’d like to add a feature that displays connections between players based on their match and organization history in a node graph. We also want to continue improving the UI and adding more features like scores for live games and user notifications for upcoming matches.
