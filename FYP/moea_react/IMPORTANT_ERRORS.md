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

I could change the background as a gradient like it is here done
https://react.dev/
![alt text](image.png)

!!!!

Friday:

DONE - Create Map

- User Profile where All teh infromations are stored, worked hours will be stored here two, for each month (user profile will be in Organization)
- Every Function should have a success rendered
- Add a moea logo to the tab

  Saturday:

DONE Support file sharing for document and resource exchange.

- Add Counting hours for each task
- Change Login Page
- Make sure the informations availlable are based on role

Sunday:

- complete Teams
- Ladning Page
- Clean Up every function

<!-- IDEAS FOR TESTING -->

If a organization is not fetching other organization records

<!-- BUGS THAT NEEDS TO BE FIXED -->

When editing the user details, the position should be as as dropdown list with the name e.g secretary not the number
Update buttons there too
For the UX i have set that the selected box is higlighted
