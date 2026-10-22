
// =====================================================
// 0. EVENTS DATA
// =====================================================

const eventsStore = [
  {
    title: "INFJ Personality Type - Coffee Shop Meet & Greet",
    description: "Being an INFJ",
    date: new Date(2024, 2, 23, 15),
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1037&auto=format&fit=crop",
    type: "offline",
    attendees: 99,
    category: "Hobbies and Passions",
    distance: 50,
  },
  {
    title:
      "NYC AI Users - AI Tech Talks, Demo & Social: RAG Search and Customer Experience",
    description: "New York AI Users",
    date: new Date(2024, 2, 23, 11, 30),
    image:
      "https://images.unsplash.com/photo-1696258686454-60082b2c33e2?q=80&w=870&auto=format&fit=crop",
    type: "offline",
    attendees: 43,
    category: "Technology",
    distance: 25,
  },
  {
    title: "Book 40+ Appointments Per Month Using AI and Automation",
    description: "New Jersey Business Network",
    date: new Date(2024, 2, 16, 14),
    image:
      "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?q=80&w=1032&auto=format&fit=crop",
    type: "online",
    attendees: 10,
    category: "Technology",
    distance: 0,
  },
  {
    title: "Dump writing group weekly meetup",
    description: "Dump writing group",
    date: new Date(2024, 2, 13, 11),
    image:
      "https://plus.unsplash.com/premium_photo-1678453146992-b80d66df9152?q=80&w=870&auto=format&fit=crop",
    type: "online",
    attendees: 77,
    category: "Business",
    distance: 0,
  },
  {
    title: "Over 40s, 50s, & 60s Senior Singles Chat, Meet & Dating Community",
    description: "Over 40s, 50s, & 60s Singles Chat, Meet & Dating Community",
    date: new Date(2024, 2, 14, 11),
    image:
      "https://plus.unsplash.com/premium_photo-1706005542509-a460d6efecb0?q=80&w=870&auto=format&fit=crop",
    type: "online",
    attendees: 140,
    category: "Social Activities",
    distance: 0,
  },
  {
    title: "All Nations - Manhattan Missions Church Bible Study",
    description: "Manhattan Bible Study Meetup Group",
    date: new Date(2024, 2, 14, 11),
    image:
      "https://plus.unsplash.com/premium_photo-1679488248784-65a638a3d3fc?q=80&w=870&auto=format&fit=crop",
    type: "offline",
    attendees: 99,
    category: "Health and Wellbeing",
    distance: 15,
  },
];

// =====================================================
// RENDER EVENT CARDS
// =====================================================

const eventsList = document.querySelector("#events-list");

function renderEvents(events) {
  if (!eventsList) return;

  eventsList.innerHTML = events
    .map((eventItem) => {
      const eventDate = eventItem.date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const eventTime = eventItem.date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

      const isOnline = eventItem.type === "online";

      const distanceText = isOnline ? "" : ` (${eventItem.distance} km)`;

      return `
        <article
          class="event-card"
          data-date="${eventItem.date.toISOString()}"
          data-type="${isOnline ? "online" : "in-person"}"
          data-distance="${eventItem.distance}"
          data-category="${eventItem.category}"
        >
          <div class="event-card__image-wrapper">
            <img
              class="event-card__image"
              src="${eventItem.image}"
              alt="${eventItem.title}"
            >
            
          </div>

          <div class="event-card__content">
            <p class="event-card__date">
              ${eventDate} · ${eventTime}
            </p>

            <h2>${eventItem.title}</h2>

            <p class="event-card__category">
              ${eventItem.category}${distanceText}
            </p>

            ${
              isOnline
                ? `
                  <span class="event-card__online-badge">
                    <img
                      src="./images/icons/Kamera.svg"
                      alt=""
                      class="event-icon"
                    >
                    <span>Online Event</span>
                  </span>
                `
                : ""
            }

            <p class="event-card__attendees">
              ${eventItem.attendees} attendees
            </p>
          </div>
        </article>
      `;
    })
    .join("");
}

renderEvents(eventsStore);

// ========================================
// 1. SEARCH FORM
// ========================================

const searchForms = document.querySelectorAll(".header__search");

const filtersForm = document.querySelector("#events-filters");
const noEventsMessage = document.querySelector("#no-events");

let filterEvents = null;

// ========================================
// 2. EVENT FILTERS
// ========================================

if (filtersForm && eventsList) {
  const dateFilter = document.querySelector("#filter-date");
  const typeFilter = document.querySelector("#filter-type");
  const distanceFilter = document.querySelector("#filter-distance");
  const categoryFilter = document.querySelector("#filter-category");

  const eventCards = Array.from(eventsList.querySelectorAll(".event-card"));

  function filterEventsByParameters(searchValue = "") {
    const selectedDate = dateFilter.value;
    const selectedType = typeFilter.value;
    const selectedDistance = distanceFilter.value;
    const selectedCategory = categoryFilter.value;

    const normalizedSearch = searchValue.trim().toLowerCase();

    const now = new Date();

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    let visibleEvents = 0;

    eventCards.forEach((card) => {
      const eventDate = new Date(card.dataset.date);
      const eventType = card.dataset.type;
      const eventDistance = Number(card.dataset.distance);
      const eventCategory = card.dataset.category;

      const eventText = card.textContent.toLowerCase();

      // DATE FILTER

      let matchesDate = true;

      if (selectedDate === "today") {
        matchesDate = eventDate.toDateString() === now.toDateString();
      } else if (selectedDate === "tomorrow") {
        matchesDate = eventDate.toDateString() === tomorrow.toDateString();
      } else if (selectedDate === "week") {
        matchesDate = eventDate >= now && eventDate <= weekEnd;
      } else if (selectedDate === "weekend") {
        const eventDay = eventDate.getDay();

        matchesDate = (eventDay === 0 || eventDay === 6) && eventDate >= now;
      }

      // EVENT TYPE FILTER

      const matchesType = selectedType === "any" || eventType === selectedType;

      // DISTANCE FILTER

      const matchesDistance =
        selectedDistance === "any" ||
        (eventType === "in-person" &&
          eventDistance <= Number(selectedDistance));

      // CATEGORY FILTER

      const matchesCategory =
        selectedCategory === "any" || eventCategory === selectedCategory;

      // SEARCH FILTER

      const matchesSearch =
        !normalizedSearch || eventText.includes(normalizedSearch);

      // SHOW OR HIDE EVENT

      const shouldShow =
        matchesDate &&
        matchesType &&
        matchesDistance &&
        matchesCategory &&
        matchesSearch;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleEvents++;
      }
    });

    // MESSAGE WHEN NO EVENTS MATCH

    if (noEventsMessage) {
      noEventsMessage.hidden = visibleEvents > 0;
    }
  }

  filterEvents = filterEventsByParameters;

  // UPDATE FILTERS

  filtersForm.addEventListener("change", () => {
    filterEvents();
  });

  // INITIAL DISPLAY

  filterEvents();
}

// ========================================
// 3. SEARCH
// ========================================

searchForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchInput = form.querySelector('input[name="search"]');

    const locationInput = form.querySelector('input[name="location"]');

    const searchValue = searchInput ? searchInput.value.trim() : "";

    const locationValue = locationInput ? locationInput.value.trim() : "";

    // SEARCH ON THE EVENTS PAGE

    if (filterEvents) {
      filterEvents(searchValue);

      if (eventsList) {
        eventsList.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // SEARCH ON THE MAIN PAGE

    const eventsSection = document.querySelector(".events-section");

    if (eventsSection) {
      eventsSection.scrollIntoView({
        behavior: "smooth",
      });
    }

    if (locationValue) {
      console.log("Selected location:", locationValue);
    }
  });
});

// ========================================
// 4. MAP PREVIEW
// ========================================

const mapPreview = document.querySelector(".events-map__preview");

const closeMapButton = document.querySelector(".events-map__close");

const browseMapButton = document.querySelector(".events-map__browse");

// CLOSE MAP

if (mapPreview && closeMapButton) {
  closeMapButton.addEventListener("click", () => {
    mapPreview.hidden = true;
  });
}

// OPEN GOOGLE MAPS

if (browseMapButton) {
  browseMapButton.addEventListener("click", () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=New+York+NY",
      "_blank",
      "noopener,noreferrer",
    );
  });
}
