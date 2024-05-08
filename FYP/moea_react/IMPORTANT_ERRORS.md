# TODO

1. Add a table users to the diagram, it is the one from supabase

# Users Page

## Addding a new person:

- Due to the error with supabase and user UID, for now the user creation is not functioning properly
- It does work with pre-determined list of personel in each organization
- It will require updates in the database, as this error is due to the fact that i am using supabase and its verification
- Therefore, for now the adding new people functionality is not possible, it is only possible with creating the users manually

- The ability to work with user UID still exists wchich will be required in palces like chat, teams, tasks as it takes that value from users2 table

# GENERAL

Add a trasnsition before loading a page to make sure all the elements are loadded

Support file sharing for document and resource exchange.

Implement a time-tracking feature to record employees' time on each task or project to generate data for payroll and project management.

Integrate Google Maps or Leaflet to display the real-time location of employees.

Allow employees to update the status of tasks, mark them as complete, or request additional information or assistance.

TODO
Notifications and alerts to keep everyone informed about task updates.

TODO
Add to every page a question mark how to use the page

Create Media queries for different phones

#####

Errors:
on dashboard when a box is hovered it the icon acts weird

Add more employyes
And Teams

/_ TODO Copy this button allover _/

.modal_button_close {
display: flex;
align-self: end;
background-color: #f44336;
padding: 1rem;
font-size: 1.6rem;
border-radius: 4px;
font-weight: 500;
cursor: pointer;
box-shadow: 0 0.5px 1.2rem rgba(0, 0, 0, 0.25);
transition: transform 0.3s ease-in-out;
}

.modal_button_close:hover {
transform: translateY(-5px);
box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

## Things To do:

- complete Teams
- Create Map
- Change Login Page
- Add Counting hours for each task
- User Profile where All teh infromations are stored, worked hours will be stored here two, for each month
- Ladning Page
- Clean Up every function
- Make sure the informations availlable are based on role
