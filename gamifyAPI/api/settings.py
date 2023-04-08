from auth2.models import EmployeePosition

MONETARY_UNIT = 'RON'

TOKEN_TO_MONEY_RATIO = 100  # 1 MONETARY_UNIT = TOKEN_TO_MONEY_RATIO tokens

TOKEN_TO_ADVANCE_ONE_POSITION = 1000  # 1 position = TOKEN_TO_ADVANCE_ONE_POSITION tokens

TOKEN_TO_ADVANCE_TO = {  # aditional tokens needed to advance to a position
    EmployeePosition.INTERN: 0,
    EmployeePosition.JUNIOR: 0,
    EmployeePosition.MIDDLE: round(TOKEN_TO_ADVANCE_ONE_POSITION * .5),
    EmployeePosition.SENIOR: round(TOKEN_TO_ADVANCE_ONE_POSITION * 1),
    EmployeePosition.MANAGER: round(TOKEN_TO_ADVANCE_ONE_POSITION * 1.5),
    EmployeePosition.LEAD: round(TOKEN_TO_ADVANCE_ONE_POSITION * 2),
}

TOKEN_FREE_DAY_PERCENTAGE = 1  # 1 free day = .days_requested * (salary_per_day * TOKEN_TO_MONEY_RATIO) * TOKEN_FREE_DAY_PERCENTAGE

TOKEN_MINIMUM_PER_DIFFICULTY = {
    'E': 50,
    'M': 100,
    'H': 200,
}