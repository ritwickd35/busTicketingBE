# Bus Ticketing System

## Overview

This Bus Ticketing System is designed to manage ticketing for a bus company. It provides a Node.js server hosted on Amazon EC2 to handle various ticketing operations for a single bus with 40 seats. Users can book, cancel, and view tickets, while administrators have additional capabilities for managing ticket status and resetting the system.

## Features

The system provides the following features:

- **Update Ticket Status**: Allows users to update the status of a ticket (open/close) and add user details to a ticket.
- **View Ticket Status**: Provides users with the ability to view the status of a specific ticket.
- **View Closed Tickets**: Displays a list of all closed tickets.
- **View Open Tickets**: Displays a list of all open tickets.
- **View Ticket Owner Details**: Allows users to view details of the person who owns a specific ticket.
- **Admin API for Resetting**: An additional API for administrators to reset the system, reopening all tickets.

## Technologies Used

- Node.js: Used to build the server application.
- Express.js: A web application framework for Node.js, simplifying the creation of RESTful APIs.
- Database (e.g., MySQL, MongoDB): To store and manage ticket data.
- Version Control System (e.g., Git): To track changes in the codebase.
