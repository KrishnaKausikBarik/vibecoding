def calculate_budget_status(total_calories, target_calories):
    remaining = target_calories - total_calories
    overage = max(0, total_calories - target_calories)

    if target_calories > 0:
        raw_percentage = round((total_calories / target_calories) * 100, 2)
    else:
        raw_percentage = 0

    if total_calories < target_calories:
        status = "within_budget"
        exceeded = False
    elif total_calories == target_calories:
        status = "budget_reached"
        exceeded = False
    else:
        status = "budget_exceeded"
        exceeded = True

    return {
        "remaining": remaining,
        "percentage": raw_percentage,
        "overage": overage,
        "exceeded": exceeded,
        "status": status,
    }
