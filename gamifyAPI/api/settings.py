from auth2.models import Position

MONETARY_UNIT = 'RON'

TOKEN_TO_MONEY_RATIO = 100  # 1 MONETARY_UNIT = TOKEN_TO_MONEY_RATIO tokens

TOKEN_TO_ADVANCE_ONE_POSITION = 1000  # 1 position = TOKEN_TO_ADVANCE_ONE_POSITION tokens

TOKEN_TO_ADVANCE_TO = {  # aditional tokens needed to advance to a position
    Position.INTERN: 0,
    Position.JUNIOR: 0,
    Position.MIDDLE: round(TOKEN_TO_ADVANCE_ONE_POSITION*.5),
    Position.SENIOR: round(TOKEN_TO_ADVANCE_ONE_POSITION*1),
    Position.MANAGER: round(TOKEN_TO_ADVANCE_ONE_POSITION*1.5),
    Position.LEAD: round(TOKEN_TO_ADVANCE_ONE_POSITION*2),
}

TOKEN_FREE_DAY_PERCENTAGE = 1  # 1 free day = .days_requested * (salary_per_day * TOKEN_TO_MONEY_RATIO) * TOKEN_FREE_DAY_PERCENTAGE
