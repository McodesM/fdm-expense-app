## 4/9/2022 Updates

Employees now see Home, Add Expense, Track Expense, View History

Admins and Line Managers now see Home, Approve Expenses, Edit Expenses, View Expenses

Input button now fixed and replaced with a new button, new css styling included in globals.css

Showcase and Add Expenses forms are only visible to employees now

## Previous Updates

Login
```
Users can not access any pages such as Track or History if not logged in

Users can track and view applications if logged in
```

Firestore DB
```
Firestore DB updated so that the application holds 3 more fields (Amount, Time_of_Appeal, Appeal)

Storing the time is changed from default milliseconds to DD MM YY HH:MM:SS in Firestore DB now
```

History
```
Users can now appeal rejected claims

History will show all applications and ability to appeal rejected applications where the user can appeal once

Format of application has changed this format now
```

Track

```

Track will only show pending or pending appealed applications

```

### Application Format

```
Email: ,
Amount: ,
Time_of_Expense: ,
Time_of_Appeal: ,
Appeal: ,
Currency: ,
Category: ,
Name: ,
Sort_Code: ,
Account_Number: ,
EvidenceLink: ,
Type: ,
Status: ,
RejectionStatement: ,
Statement: ,
Line_Manager: 
```
