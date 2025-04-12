function addNumbers(numbersArray) {
    return numbersArray.reduce((sum, num) => sum + num, 0);
}
document.getElementById("add").innerHTML = addNumbers([3, 7, 9, 2, 9])

function findMaxNumber() {
    return Math.max(...arguments);
}
document.getElementById("max").innerHTML = findMaxNumber(10, 20, 30, 47, 54)

function addOnlyNumbers(mixedArray) {
    return mixedArray.map(item => parseFloat(item)).filter(num => !isNaN(num)).reduce((sum, num) => sum + num, 0); 
}
document.getElementById("only").innerHTML = addOnlyNumbers([8, "52 ", "3.7 cats", true, "dogs9"])

function getDigits(str) {
    return str.match(/\d+/g)?.join('') || ''; 
}
document.getElementById("digits").innerHTML = getDigits("a34j3d57")

function reverseString(str) {
    return str.split('').reverse().join('');
}
document.getElementById("reverse").innerHTML = reverseString("See you later!")

function getCurrentDate() {
    const date = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
document.getElementById("date").innerHTML = getCurrentDate()
