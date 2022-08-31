export default function titleize(string) {
    const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With']
    const uppers = ["Tv", "Id", "Ii", "Iii", "Iv", "Vi", "Vii", "Viii", "Ix"]

    let wordList = string.split(" ").map(string => string.length > 0 ? string[0].toUpperCase() + string.slice(1).toLowerCase() : "")
    wordList = wordList.map((word, index) => lowers.includes(word) && index !== 0 ? word.toLowerCase() : word)
    wordList = wordList.map((word, index) => uppers.includes(word) ? word.toUpperCase() : word)

    return wordList.join(" ").trim()
}