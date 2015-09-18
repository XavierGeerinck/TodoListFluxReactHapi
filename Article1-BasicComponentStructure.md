# Creating a TODO Application from scratch in React.JS / Flux / Hapi (part 1)
## 1. Introduction
This post is part of a three part series that I am writing about how you can create a well designed and structured React.JS application. In part 1 we will delve into the basics of React.JS and how we can convert your application idea into a working React.JS component. After that we will create a small piece of backend code in Hapi that will interact with a easy to use disk adapter for simplicity (part 2) and last but not least we will then create the interaction between our component and API by using the flux architecture. So let's get started.

## 2. How components work
React.JS it's vision is to enable us to re-use code quickly by splitting it up in components. Components are small pieces of code that are bundled in one little package. These componens then have a state that contains the information about that specific component. Think for example of an input box, it's state would be the value that you put in it it's properties would be the name, placeholder, type, ...

Every component is then able to perform actions (onClick, onChange, ...) which we can define through properties. I try to keep the idea of letting the components define actions through properties and my pages through stores. That way we got a state for a page but make sure that we can re-use the components.

> It is also a good practice to bundle your css of a specific component into that component folder. This will make it possible to really drag and drop components as you go. Be careful though and keep a good naming convention since else you will end up overwriting other components. A nice practice that I follow is to name your className the name of your component and add dashes to give it more information.

By converting all our code into components we achieve multiple goals
1. Maximum reusability; we can just drag and drop and re-use components (if they are written correctly)
2. Better security; by recreating existing html components (for example input) we can prevent security issues from happening (think of xss).
3. Fast POC building; when you have a library, you can just drag and drop existing components, apply a new style and you got a POC in a few hours instead of days.
4. Complex forms are easy; Ever tried to make a page with 20 input fields in Angular, Plain html? Then you know forms are a pain! React makes this as aeasy as possible and we can even add validation and others by bundling it all in a single component.
5. Need updates to your application when something changes? React got you covered, by using a store and state change listeners we are able to update just the components that are needed. No need to refresh the complete page.

These advantages are in my personal opinion the future of the web. No need to juggle around bad code to prevent XSS injection attacks, easy forms and most import re-usability is what we need!

## 3. The application that we will be creating
Now let's get started building an application. For this tutorial I am going to write the "Hello World" of a web application. A todo list. Todo Lists seem simple but cover a lot of important aspects:

* CRUD Operations (Create, Read, Update and Delete)
* Dynamic flows; We see the component being added in real time allowing for a beautiful flow.
* Forms
* Some CSS of course

**Example of what we will be creating:**

![http://xaviergeerinck.com/wp-content/uploads/2015/09/TodoList-e1442575859548.png](http://xaviergeerinck.com/wp-content/uploads/2015/09/TodoList-e1442575859548.png)

## 4. Splitting it up
The most important task of React is to split up our component so we can re-use it. This is not always that easy, you have to keep in mind that the state of the component can change. But that your "page" it's store also should get updated. In case of the todo app we will take this picture as our break up:

![http://xaviergeerinck.com/wp-content/uploads/2015/09/TodoList-Marked.png](http://xaviergeerinck.com/wp-content/uploads/2015/09/TodoList-Marked.png)

Here we see a couple of components:

* **TodoList Page:** This is our page where we will put in the todolist component. 
* **TodoList Component:** This is the component that we will be able to integrate into our page.
* **TodoListAdd:** The input box to add new todo items
* **TodoList:** The list of items
* **TodoListItem:** An item itself

Now we got the different components to create. Important to do now is to imagine how you would fit it in your application, are you able to incorporate it? Are you able to give it starting items? How would your page work with it? All those questions will convert into our next step, where we will define the folder structure.

## 5. The folder structure
Creating the folder structure is the backbone of our application, it should be dynamic to grow over time, but not to dynamic so that we can actually understand it. While creating a private project for myself I found out over time that the following directory structure is a basic one where I can work with.

> Please note that this folder structure is purely personall, you can change this to your likings but I myself found it to be working well.

### Folder structure

```
- build/
- src/
    - js/
        - actions/                      # Actions will be called by components and they will adapt a store, everything that ends on Server received a response from the server
        - components/                   # Contains the components of our application (Includes pages!)
            - App/                      # Main component, available on every page!
            - elements/                 # consists out of all the different elements (drag and drop elements). Try to keep these storeless so that we can reuse them!
            - layouts/                  # Different page layouts, example: Frontpage, Dashboard, Settings, ...
            - pages/                    # Collection of elements bundled together to form a page (Settings, Team, ...)
            - variables.css             # Contains CSS variables such as colors
        - constants/                    # Contains the constants such as the actionTypes
        - dispatchers/                  # Dispatchers, we make a difference between Server and View actions, more about this later
        - stores/                       # The stores contain the state of a page as a whole, a nice example is a AuthStore, this will contain the details about a user and it's logged in state
        - utils/                        # Contains API files, Example: AuthAPIUtils, makes API calls
        - index.js                      # Entry point for our app
        - routes.js                     # The routes for our app, we use react-router for this
    - index.html
- .babelrc                              # babel config, set on level 1
- .gitignore                            # files not to be pushed to git
- package.json                          # dependencies
- README.md
- webpack.config.js                     # workflow configuration for fast development
```

## 6. End Note
Now that we have the folder structure we got the basic building blocks and architecture to start building our react app. The actual building of this app will be done in part 2 of this tutorial series. There we will create the code for the components and get it to load our page. After that part we will then create an API and interact with that API through the actions.