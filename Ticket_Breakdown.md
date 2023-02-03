# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

I can imagine a couple of ways that what's being requested could be fulfiled. One option would be to add a column on the Agents table that takes a JSON array of objects as data, so that you would be able to add objects to represent the custom ids each facility has for any given Agent. The problem with this approach is that as the number of facilities and agents grow, and as more and more agents work on different facilities, the JSON array that contains the custom id that each facility grants to an agent would grow aswell. While having databases grow in data is expected, problems would appear down the line if we need to query agents by a customId. Because the data stored is an array of objects, the database engine would need to parse the contents of the array before it starts trying to match it to the query. Furthermore, you would not be able to create an efective index to accelerate those queries, adding to the performance problem being outlined.
The second approach that I can imagine taking is to create another table, `AgentFacilityCustomIds` that would have three columns, one for the id of the facility, another one for the id of the Agent and finally a column for the customID that the facility has for the agent. This approach would allow many advantages over the last approach. For starters as the data grows, querying this table will not become an issue. You would be able to create efective indexes for the table, and join it with other tables while querying efficiently. 

If we were to break this feature into tickets, I would do it like this:

- Name: Create AgentFacilityCustomIds table
    - Description: We need to create a new table on the database under the name "AgentFacilityCustomIds" to store the custom ids that facilities have for our Agents. The table needs to have three columns with the same data type as the ids that are being stored on our Agents and Facilities.
    - Implementation: The first two columns, called "agentId" and "facilityId" are foregin keys related to the primary keys of the `Agents` and `Facilities` tables. The third column, "customId", needs to be of the same type as the other two. The primary key for this table would be the pair of foreign keys mentioned before.
    - Acceptance Criteria: The table should be accesible on the DB, and built according to the implementation described before.
    - Time/Effort: 2 hours as a safe estimate.
- Name: Modify `getShiftsByFacility` to return the agent's customId for the facility
    - Description: Per the definition of the ticket, this function returns data from the agents that worked shifts for the facility. When the function retrieves the data for the Agent, it should also check if the facility uses a custom id for the agent. If it does, the customId should be used instead of the db internal Id for the agent.
    - Implementation: I'd suggest we modify the query being used to retrieve the data from the facility, agent and shifts table, adding a `left join` with the `AgentFacilityCustomIds` table. After that, we the need to check if there's a custom id for the agent being used by the facility, and replace the agents id with the custom id being returned.
    - Acceptance Criteria: Unit tests that cover the new functionality. It should cover both cases, one where a customId exists for the agent-facility pair and is being used instead of the internal ID, and another one that checks that the internal id is being returned in cases where the facility does not have a customid for the agent.
    - Time/Effort: 3 hours +- 1 hour, depending on the complexity of the data processing being done by the function.

With these two tickets the feature would be done. Because the custom id is replacing the DB internal id, no further modifications would be needed for the last step of the process. `generateReport`. This function would recieve the same data as before, but with the customId that the facility uses for the agent if it has one.