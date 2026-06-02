const UNSPLASH_KEY = "Gz4SqzG3XQJsuJH-TBdXerslUCS3m_Y9vrtuBAN0rF4";
const OWM_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE"; // replace with your key

function qs(name){return new URLSearchParams(window.location.search).get(name);}
const place = qs('place') ? decodeURIComponent(qs('place')) : 'Unknown';
document.getElementById('destInput').value = place;

async function fetchPlacePhotos(q, per=5){
  const url=`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${per}`;
  const res=await fetch(url,{headers:{Authorization:"Client-ID "+UNSPLASH_KEY}});
  return (await res.json()).results;
}

async function fetchWeatherForecast(city){
  if(!OWM_KEY.includes("YOUR_OPENWEATHERMAP")){
    const url=`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric`;
    const res=await fetch(url); return res.json();
  }
  return {error:"Add OpenWeatherMap key"};
}

function generateItineraries(place,people,days,notes){
  return [1,2,3].map(i=>{
    let txt=`Itinerary ${i}: Explore ${place} for ${days} days.\nSuitable for ${people} people.`;
    if(notes) txt+=`\nNotes: ${notes}`;
    return txt;
  });
}

function openChat(){document.getElementById('chatbot').classList.add('open');}
function showZoom(src){document.getElementById('zoomImg').src=src;document.getElementById('zoom').style.display='flex';}
function hideZoom(){document.getElementById('zoom').style.display='none';}

function displayChat(photos,itins,weather){
  const c=document.getElementById('chatContent'); c.innerHTML='';
  const hint=document.createElement('div'); hint.className='text-muted'; hint.textContent='You can zoom photos'; c.appendChild(hint);
  const row=document.createElement('div'); row.className='photo-row';
  photos.slice(0,4).forEach(p=>{let img=document.createElement('img'); img.src=p.urls.thumb; img.onclick=()=>showZoom(p.urls.regular); row.appendChild(img);});
  c.appendChild(row);
  if(weather){let w=document.createElement('div'); w.className='itinerary'; w.textContent=weather; c.appendChild(w);}
  itins.forEach(it=>{let d=document.createElement('div'); d.className='itinerary'; d.textContent=it; c.appendChild(d);});
}

document.getElementById('tripForm').addEventListener('submit',async e=>{
  e.preventDefault(); openChat();
  const people=document.getElementById('people').value, days=document.getElementById('days').value, notes=document.getElementById('notes').value;
  const photos=await fetchPlacePhotos(place,6).catch(()=>[]);
  const w=await fetchWeatherForecast(place);
  let weather=null; if(w.list){weather=`Avg Temp ~ ${w.list[0].main.temp}°C`;}
  const itins=generateItineraries(place,people,days,notes);
  displayChat(photos,itins,weather);
});
