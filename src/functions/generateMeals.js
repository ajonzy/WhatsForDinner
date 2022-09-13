import titleize from "./titleize"

export default function generateMeals(user, number, rules) {
    let meals = [...user.meals]
    const requiredMeals = []
    const numberedMeals = []
    const numberedRequiredMeals = []
    const currentSelectedMeals = []
    let bestSelectedMeals = []
    let bestCompactSelectedMeals = []
    let finalSelectedMeals = []

    rules.forEach(rule => {
        switch(rule.rule) {
            case "None": {
                if (rule.type === "Category") {
                    meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(titleize(rule.value)))
                }
                else {
                    meals = meals.filter(meal => meal[rule.type.toLowerCase()] != titleize(rule.value))
                }
                break
            }
            case "Exactly": {
                if (
                    (rule.type === "Category" && meals.filter(meal => meal.categories.map(category => category.name).includes(titleize(rule.value))).length < rule.amount) ||
                    (rule.type !== "Category" && meals.filter(meal => meal[rule.type.toLowerCase()] == titleize(rule.value)).length < rule.amount) ||
                    (rules.filter(rule => rule.rule === "None").filter(noneRule => noneRule.value === rule.value).length > 0)
                ) {
                    setGeneratedProblem(true)
                }
                else {
                    for (let i=0; i<rule.amount; i++) {
                        requiredMeals.push({
                            type: rule.type,
                            value: titleize(rule.value),
                            amount: rule.amount
                        })
                    }
                    numberedMeals.push({
                        type: rule.type,
                        value: titleize(rule.value),
                        amount: rule.amount
                    })
                }
                break
            }
            case "No more than": {
                if (
                    (rules.filter(rule => rule.rule === "Exactly").filter(exactlyRule => exactlyRule.type === rule.type && exactlyRule.value === rule.value).filter(exactlyRule => exactlyRule.amount > rule.amount).length > 0) ||
                    (rules.filter(rule => rule.rule === "At least").filter(atLeastRule => atLeastRule.type === rule.type && atLeastRule.value === rule.value).filter(atLeastRule => atLeastRule.amount > rule.amount).length > 0)
                ) {
                    setGeneratedProblem(true)
                }
                else {
                    numberedMeals.push({
                        type: rule.type,
                        value: titleize(rule.value),
                        amount: rule.amount
                    })
                }
                break
            }
            case "At least": {
                if (
                    (rule.type === "Category" && meals.filter(meal => meal.categories.map(category => category.name).includes(titleize(rule.value))).length < rule.amount) ||
                    (rule.type !== "Category" && meals.filter(meal => meal[rule.type.toLowerCase()] == titleize(rule.value)).length < rule.amount) ||
                    (rules.filter(rule => rule.rule === "None").filter(noneRule => noneRule.value === rule.value).length > 0) ||
                    (rules.filter(rule => rule.rule === "Exactly").filter(exactlyRule => exactlyRule.type === rule.type && exactlyRule.value === rule.value).filter(exactlyRule => exactlyRule.amount < rule.amount).length > 0)
                ) {
                    setGeneratedProblem(true)
                }
                else {
                    for (let i=0; i<rule.amount; i++) {
                        numberedRequiredMeals.push({
                            type: rule.type,
                            value: titleize(rule.value),
                            amount: rule.amount
                        })
                    }
                }
                break
            }
        }
    })

    
    let bestSelectedNumber = [...requiredMeals, ...numberedRequiredMeals].length

    const generator = requiredMeals => {
        if (currentSelectedMeals.length > bestSelectedMeals.length || (currentSelectedMeals.length >= bestSelectedMeals.length && requiredMeals.length < bestSelectedNumber)) {
            bestSelectedMeals = [...currentSelectedMeals]

            if (bestSelectedMeals.length <= number && (bestSelectedMeals.length > bestCompactSelectedMeals.length || (bestSelectedMeals.length >= bestCompactSelectedMeals.length && requiredMeals.length < bestSelectedNumber))) {
                bestSelectedNumber = requiredMeals.length
                bestCompactSelectedMeals = [...bestSelectedMeals]
            }
        }
        
        if (requiredMeals.length < bestSelectedNumber) {
            bestSelectedNumber = requiredMeals.length
        }

        if (requiredMeals.length === 0) {
            if (bestSelectedMeals.length + meals.length < number || bestSelectedMeals.length > number) {
                return false
            }

            finalSelectedMeals = bestSelectedMeals
            return true
        }

        let mealChoices = []
        let affectedNumberedMeals = []
        let removedMeals = []
        let selectedMeal = {}
        let iteration = 0
        const requiredMeal = requiredMeals.pop()
        
        if (requiredMeal.type === "Category") {
            if (currentSelectedMeals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value)).length >= requiredMeal.amount) {
                const nextResult = generator(requiredMeals)

                if (!nextResult) {
                    requiredMeals.push(requiredMeal)
                    return false
                }
                else {
                    return true
                }
            }

            mealChoices = meals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value)).sort(function(){return 0.5 - Math.random()})
        }
        else {
            if (currentSelectedMeals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value).length >= requiredMeal.amount) {
                const nextResult = generator(requiredMeals)

                if (!nextResult) {
                    requiredMeals.push(requiredMeal)
                    return false
                }
                else {
                    return true
                }
            }

            mealChoices = meals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value).sort(function(){return 0.5 - Math.random()})
        }

        while (iteration < mealChoices.length && mealChoices.length !== 0) {
            if (mealChoices.length > 0) {
                selectedMeal = mealChoices[iteration]
        
                numberedMeals.forEach(numberedMeal => {
                    if (numberedMeal.type === "Category") {
                        if (selectedMeal.categories.map(category => category.name).includes(numberedMeal.value)) {
                            affectedNumberedMeals.push(numberedMeal)
                            numberedMeal.amount -= 1
                        }
        
                        if (numberedMeal.amount === 0) {
                            removedMeals = meals.filter(meal => meal.categories.map(category => category.name).includes(numberedMeal.value))
                            meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(numberedMeal.value))
                        }
                    }
                    else {
                        if (selectedMeal[numberedMeal.type.toLowerCase()] == numberedMeal.value) {
                            affectedNumberedMeals.push(numberedMeal)
                            numberedMeal.amount -= 1
                        }
        
                        if (numberedMeal.amount === 0) {
                            removedMeals = meals.filter(meal => meal[numberedMeal.type.toLowerCase()] == numberedMeal.value)
                            meals = meals.filter(meal => meal[numberedMeal.type.toLowerCase()] != numberedMeal.value)
                        }
                    }
                })

                currentSelectedMeals.push(selectedMeal)
                const nextResult = generator(requiredMeals)

                if (nextResult) {
                    break
                }
                else {
                    currentSelectedMeals.pop()
                    meals.push(...removedMeals)
                    affectedNumberedMeals.forEach(numberedMeal => numberedMeal.amount += 1)
                    affectedNumberedMeals = []
                    iteration++
                }
            }
            else {
                requiredMeals.push(requiredMeal)
                return false
            }
        }

        if (iteration >= mealChoices.length || mealChoices.length === 0) {
            requiredMeals.push(requiredMeal)
            return false
        }

        return true
    }

    const allRequiredMeals = [...requiredMeals, ...numberedRequiredMeals].sort(function(){return 0.5 - Math.random()})
    let iteration = 0
    let result = true

    while (iteration < allRequiredMeals.length) {
        result = generator(allRequiredMeals)

        if (result) {
            break
        }
        else {
            allRequiredMeals.push(allRequiredMeals.shift())
            iteration++
        }
    }

    if (number > user.meals.length) {
        number = user.meals.length
        result = false
    }

    if (result) {
        if (finalSelectedMeals.length < number) {
            finalSelectedMeals.push(...meals.sort(function(){return 0.5 - Math.random()}).slice(0, number - finalSelectedMeals.length))
        }

        return {
            selectedMeals: finalSelectedMeals,
            problem: false
        }
    }
    else {
        if (rules.length <= number) {
            if (number - bestSelectedMeals.length > meals.length) {
                meals = [...user.meals].filter(meal => !bestSelectedMeals.map(selectedMeal => selectedMeal.id).includes(meal.id))
            }

            if (bestSelectedMeals.length < number) {
                bestSelectedMeals.push(...meals.sort(function(){return 0.5 - Math.random()}).slice(0, number - bestSelectedMeals.length))
            }

            return {
                selectedMeals: bestSelectedMeals,
                problem: true
            }
        }
        else {
            if (number - bestCompactSelectedMeals.length > meals.length) {
                meals = [...user.meals].filter(meal => !bestCompactSelectedMeals.map(selectedMeal => selectedMeal.id).includes(meal.id))
            }

            if (bestCompactSelectedMeals.length < number) {
                bestCompactSelectedMeals.push(...meals.sort(function(){return 0.5 - Math.random()}).slice(0, number - bestCompactSelectedMeals.length))
            }

            return {
                selectedMeals: bestCompactSelectedMeals,
                problem: true
            }
        }
    }
}