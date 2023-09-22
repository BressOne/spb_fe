# Superb coding exercise

# Restaurant Reservation API

This repository contains an example implementation of a restaurant table reservation UI using ReactJS.

## FE part

Provided exercise is an example implementation of UI based on NextJs + ReactJS+ChakraUI. This UI app operates over restaurant API provided in https://github.com/BressOne/spb_be.

To get started, ensure you are running nodeJS 18.17.1 LTS.

Stability is not guaranteed if you are using older versions of NodeJS.

1. [Requirements](##Requirements)

2. [Installation](##Installation)

3. [Environment](##Environment)

4. [UI](##UI)

5. [Features](##Features)

6. [Todos](##Todos)

## Requirements

1. nodejs 18.17.1

2. WSL/Linux/MacOS

3. yarn 1.22.5

## Installation

To install dependencies use `yarn`.

In the `.env` file in the root of the project point the API uri `NEXT_PUBLIC_API_URL`

NOTE: no trailing , please.

Once done just simply run `yarn dev`, to run dev mode.

Or dev build with `yarn build` and `yarn start` commands. The app will appear on localhost:3000 by default.

Another way to run setup - simply build a docker image out of provided Dockerfile

## Environment

There are several env vars, which the service can be adjusted with:

| var                 | effect                      |
| ------------------- | --------------------------- |
| NEXT_PUBLIC_API_URL | References API to work with |

My default dev config is:

    NEXT_PUBLIC_API_URL=http://localhost:3001

## UI

UI is actually sipmle. There are 4 (formally 3) pages served on different uris.


| route | description |
| - | - | 
| / | login screen of the app. Use admin/admin if you are running API with DB propagated with demo data. |
| /restaurant | The restaurant info. The user has one-to-one relation with a restaurant, so it is semantically equals to the user context. On the page you can see and edin restaurants name and open hours. Due to some limitations we assume working hours are required for each week day. Restaurants time offset is not well implemented feature, but was tend to allow to het through difficulties setting up reservations for restaurant, when the manager does that being in different time band (offset) |
| /reservations | Is a schedule like table. That shows past and future reservations for each table in its own subSchedule. You cah switch view to see week reservations or day reservations, you can navigate over calendar, yopu can set up filter to see reservations for particular table. you can delete existing reservation by clicking on it in schedule and clicking on a bin icon in the popup. Confirm window will appear. By clicking on add new Reservation button you will be able to add a new reservation for some guest. Form is pretty simple. |
| /tables | Simple list of existing tables. You can create a new table by clicking on button and specifying a name for the table. You can delete a table by clicking on a bin near the tables name. Note, that all table reservations assigned for the table will be deleted too. By cliscking schedule button near a tables name you will be redirected to the tables schedule. Formally it is a /reservations route with filter applied.                                                                                                         |     |

## Features

### TypeScript v5.

App is covered by TS with al files it has.

### Schedule ui.

The dx-react-scheduler package in a React app provides a feature-rich and customizable scheduling and calendar component, simplifying the development of applications that require advanced event and time management functionality.

Reservations have a pretty display functionality. Yet the library used requires mui component library which is not so perfect for bundling.

### Auth and Access controll.

App holds a very basic auth and validation. It shows basic concept of handling auth and keepoing it as context. Current implementation shows:

- authentication,

- authorization,

- continue session mechanism,

which is more than enough for basic purpouses.

Check middlewares `src/contexts` folder to check how api and identyty contexts operate together.

### nextJS.

Next.js offers advantages such as server-side rendering (SSR) and automatic code splitting, leading to improved performance and SEO, while also simplifying the development of complex React applications by providing built-in routing and a strong ecosystem of plugins and tools.

### Containerization.

Using Docker containerization for a Node.js app provides a consistent and isolated environment, ensuring that the application runs the same way across different platforms and simplifying deployment and scaling processes. It also facilitates easy collaboration among development teams and simplifies dependency management

### Component library.

Using Chakra UI in a React app allows for rapid development and consistent design through a collection of pre-built and customizable components, saving time on front-end development and ensuring a cohesive and visually appealing user interface.

No need to use heavy-custom ui if you are building admin pannel app, right?

## TODOS

1. build api endpoint filter to recieve week-wise reservations, as currently you'll recieve the whole reservation list for all the tables for the restaurant which is way too bad and critical

2. tests, there are no at all right now, which is a pitty

3. integrate with dx-react-scheduler without mui adapters, write own chakraui interface for schedules

4. implement timeband and timezones support: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/TimeZonesSupport/React/Light/

5. implement table reservation transition between the tables https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/grouping/#move-appointments-between-groups

6. implement reservation editing: https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/editing/

7. extend user(admin) to have more than one restaurant as an origin and entity to work with.
