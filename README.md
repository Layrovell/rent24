<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="src/assets/logo.svg" width="200" height="60" />
  </a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">
    Made with <a href="http://nodejs.org" target="_blank">Node.js</a>, a progressive framework for building efficient and scalable server-side applications.
  </p>

  <p align="center">
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/typescript-v4.5.2-3178c6?logo=typescript&logoColor=3178c6" alt="TypeScript Badge" />
  </a>
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/nestjs-v8.0.0-E0234E?logo=nestjs&logoColor=E0234E" alt="NestJS Badge" />
  </a>
  <a href="https://nodejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/node.js-^20.3.1-339933?logo=node.js&logoColor=339933" alt="Node.js Badge" />
  </a>
  <img src="https://img.shields.io/badge/coverage-0%25-brightgreen" alt="Coverage Badge" />
  </a>
  <a href="https://www.npmjs.com" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

#### Business Problem:

Finding suitable accommodation can often be a complex, opaque, and time-consuming process, leading to frustration for users. Many existing platforms provide insufficient details, have unclear agent or owner representation, and lack robust mechanisms to ensure property authenticity. Additionally, unverified listings and the prevalence of scams can erode trust in the platform.

#### Solution:

This project aims to create a transparent, user-friendly accommodation search platform that simplifies the process for both seekers and property owners. The app will provide comprehensive information for each property, minimizing the need for follow-up questions and confusion. Users will know whether the poster is an agent or a private individual, ensuring clarity.
All property listings will undergo a thorough moderation process before going live, ensuring that all required details, such as complete room photos, are provided. Unlike other platforms that scrape listings from external sites, every property will be directly created by users.
To enhance trust and reduce the risk of fraud, the app will feature a user verification system, granting verified users a special badge that signifies legitimacy.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests (TBC)

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Role Definitions

#### Guest:

Unregistered users who can view listings but cannot take any actions like saving properties or renting them. They must register to become a User or an Agent.

#### User (default role, can act like an Owner):

A registered user who can perform actions such as renting properties, saving properties, and posting their own properties as an owner.
This role covers the functionality of a typical user and owner combined.
Users can list properties they own (acting as an owner) but cannot act as an agent for other owners.

#### Agent:

An Agent can act on behalf of multiple property owners, post listings, and manage properties for others.
Agents may have fields like commissionRate and companyName that apply specifically to their agency work.
They have distinct responsibilities from regular users because they deal with third-party property management.
If the Agent wants to post their own property (acting as an Owner), they should be able to do so while maintaining their ability to post properties on behalf of others.

## Entities:

- **User**: During registration, only the essential fields (like email, password, and role) are saved to the User entity.
- **Profile**: The Profile entity is created later when the user interacts with the app further (like accessing the settings page), where they can complete additional information.
- **ActivityLog**: The ActivityLog entity records all significant actions performed by the user in the app. It provides a history of user activities, which helps in monitoring, auditing, and providing transparency over what actions were taken within the system.
- **Properties**: The list of properties posted by user or agent (each property will have moderation stage in the future).
- **Activities**: Types of user activity, such as registration or change profile, posted or liked property.
- TBC (Property Details and Amenities tables etc.)

## Techniques

1. Modular Design: separated Profile from User entity;
1. Separation of Concerns: The profile logic is entirely separated from the user logic, making the codebase cleaner and more modular.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- [NestJS Documentation](https://docs.nestjs.com);
- [TypeORM Documentation](https://typeorm.io);

## Important

1. Users are not able to update/delete data that don't belong them (properties, profiles, etc). They are restricted from actions that not related to them.
2. Some or users actions are tracked such as registration, updating the profile or post the property to make a history of user actions.
3. Base 'user' allowa to create 5 peoperties at most. To create more they should have an 'agent' role. 

## TODO

1. Property Details table (to store specific data related to property details info such as number of floors, wall type, years buit, square footage, etc). *(done)*
2. Property Amenities table (to store specific data related to amenities such as security system, fireplace, elevator, furnished etc). <br/> *(in process)*
3. Devide Profile into 'UserProfile' and 'AgentProfile' to easy active or deactivate agent abilities.
4. Subscribtions system, that alow user to act as an agent.
5. Email recover and change using email module.
6. Run over app security (xss, cookie, cors policies).
7. Add moderation stage to property posting. Ex. the one can be posted but with some flag 'isModerated' and after property is moderated it will displayed with other as well.
8. Tests set up and coverage.
9. Add user sessions to be logged in in different devices and track it allowing to delete a muddy (suspicious) session.
10. Move some of the endpoints to a separate place/whatever that will be used on separate admin panel.
    (such as create new wall/activity type or detail related to property, etc.).
11. TBC
