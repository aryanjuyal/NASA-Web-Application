const NASA_API_BASE_URL = 'https://api.nasa.gov/planetary/apod';

let apiKey = 'yd3wQF3gvqPWM6PeUQuwUqn80cFKYfU4sFqMbHgG';

let currentDate = new Date();

const photoElement = document.querySelector('.photo img');
const buttonContainer = document.querySelector('.button');
const previousBtn = document.getElementById('previous-btn');
const nextBtn = document.getElementById('next-btn');
const currentDateElement = document.getElementById('date-display');
const about=document.getElementById('explanatory-text');
const title_image=document.getElementById('title');


function formatDate(date) {
    return date.toISOString().split('T')[0];

}
async function fetchAPOD(date) {
    const dateString = formatDate(currentDate);
    const url = `${NASA_API_BASE_URL}?api_key=${apiKey}&date=${dateString}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Invalid API key. Please check your NASA API key.');
            } else if (response.status === 400) {
                throw new Error('Invalid date. Please select a valid date.');
            } else if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please try again later.');
            } else {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log(data)
        photoElement.src = data.url;
        currentDateElement.textContent = dateString;
        about.textContent = data.explanation;
        title_image.textContent = data.title;

        // Hide next button if displayed date is today, show otherwise
        if (formatDate(new Date()) === dateString) {
            nextBtn.style.display = "none";
        } else {
            nextBtn.style.display = "block";
        }

        return data;
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}


function nextDate(){
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        currentDate = newDate;
        photoElement.src = "1476.gif";
    
    fetchAPOD();
}

function prevDate(){
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    currentDate = newDate;
    photoElement.src = "1476.gif";
    fetchAPOD();
}

nextBtn.addEventListener('click', nextDate);
previousBtn.addEventListener('click', prevDate);

fetchAPOD();
