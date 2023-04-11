from auth2.models import EmployeePosition

MONETARY_UNIT = 'RON'

TOKEN_TO_MONEY_RATIO = 100  # 1 MONETARY_UNIT = TOKEN_TO_MONEY_RATIO tokens

TOKEN_TO_ADVANCE_ONE_POSITION = 5000  # 1 position = TOKEN_TO_ADVANCE_ONE_POSITION tokens

TOKEN_TO_ADVANCE_TO = {  # aditional tokens needed to advance to a position
    EmployeePosition.INTERN: 0,
    EmployeePosition.JUNIOR: 0,
    EmployeePosition.MIDDLE: round(TOKEN_TO_ADVANCE_ONE_POSITION * .5),
    EmployeePosition.SENIOR: round(TOKEN_TO_ADVANCE_ONE_POSITION * 1),
    EmployeePosition.MANAGER: round(TOKEN_TO_ADVANCE_ONE_POSITION * 1.5),
    EmployeePosition.LEAD: round(TOKEN_TO_ADVANCE_ONE_POSITION * 2),
}

TOKEN_FREE_DAY_PERCENTAGE = 3  # 1 free day = days_requested * (salary_per_day * TOKEN_TO_MONEY_RATIO) * TOKEN_FREE_DAY_PERCENTAGE

TOKEN_POINTS = {  # how many points each difficulty level weights in the leaderboard
    'E': 10,
    'M': 20,
    'H': 40,
}

TOKENS_BACK_AFTER_REJECTION = 0.5  # 50% of the tokens are returned to the user if the request is rejected by the CEO
