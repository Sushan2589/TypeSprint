async function getSentence() {
    try {
        const response = await fetch(
            "https://dummyjson.com/quotes/random"
        );

        const data = await response.json();

        console.log(data);
        console.log(data.quote);

    } catch (error) {
        console.log("Something went wrong:", error);
    }
}

getSentence();