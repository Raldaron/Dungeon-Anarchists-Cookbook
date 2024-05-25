document.addEventListener("DOMContentLoaded", function() {
    const textElement = document.getElementById("text");
    const buttonsElement = document.getElementById("buttons");
    const sidenavElement = document.getElementById("sidenav");
    const entriesElement = document.getElementById("entries");

    let text = `Hello, Crawler.
As you’re about to find, this is a very special book.
If you’re reading these words, it means this book has found its way into your hands for one purpose and one purpose only.
Together, we will burn it all to the ground.`;

    let mainText = `The Dungeon Anarchist’s Cookbook
25th Edition

Potions, Explosives, Traps, Secret Societies, Dungeon Shortcuts, and more. Much more. This guide to creating chaos was originally generated into the system during the fifteenth season. It was awarded to the High Elf Crawler Porthus the Rogue on the ninth floor, disguised as a blank sketchbook. The fact you’re reading this indicates that this book and the knowledge within remains active in the code. It has been passed down from dungeon to dungeon. It is automatically generated after a set of predetermined conditions have been met. It will disappear from your inventory upon death or retirement where it will find its way to a worthy recipient in a future crawl.
There is only one price for access to these pages. You must pass your own knowledge on.
In your messaging menu, you will find a scratchpad. If you’ve yet to discover this, it is a place to mentally write down recipes or thoughts or anything else you wish to recall. If you look now, you will find you have been given one extra page into your scratchpad. Anything you add to this second page will be included in the 25th edition of this book.
While the true contents of this guide are invisible to the showrunners and to the viewers, it is not invisible to the current System AI. There is nothing about owning this book, or the information hidden within that is against the rules. However, if the organization running this season begins to suspect that this book is more than it appears, or if you tell anyone about the existence of this book, the information within will erase, and you will forever lose access to the hidden text.
This is important. While this book’s contents may be invisible, your actions are not. You must become an actor. Every recipe, every secret, if utilized, must be presented to the outside world as if you are discovering this all on your own. How you do that is up to you. Do not spend too much time staring at these pages.`;

    let cursorPosition = 0;
    let typeSpeed = 5; // typing speed in milliseconds

    // Check if the user has visited before
    if (localStorage.getItem('visited')) {
        showMainContent();
    } else {
        typeWriter();
        localStorage.setItem('visited', 'true');
    }

    function typeWriter() {
        if (cursorPosition < text.length) {
            textElement.textContent += text.charAt(cursorPosition);
            cursorPosition++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            setTimeout(() => {
                textElement.textContent += "\n\nWill you join us?";
                buttonsElement.style.display = "flex";
            }, 100);
        }
    }

    document.getElementById("accept").addEventListener("click", function() {
        fadeToBlack(() => {
            openSidenav();
            showNewText();
            populateEntries();
        });
    });

    document.getElementById("decline").addEventListener("click", function() {
        fadeToBlack();
    });

    function fadeToBlack(callback) {
        document.body.style.transition = "background-color 1s";
        document.body.style.backgroundColor = "black";
        textElement.style.transition = "color 1s";
        textElement.style.color = "black";
        buttonsElement.style.transition = "display 1s";
        buttonsElement.style.display = "none";
        setTimeout(callback, 1000);
    }

    function openSidenav() {
        sidenavElement.style.display = "flex"; // Show the side navigation
    }

    function showNewText() {
        textElement.style.color = "#00FF00"; // Brighter green
        textElement.style.opacity = 0;
        textElement.textContent = mainText;
        textElement.style.transition = "opacity 1s";
        textElement.style.opacity = 1;
        entriesElement.style.display = "block";
    }

    function showMainContent() {
        textElement.style.color = "#00FF00"; // Brighter green
        textElement.textContent = mainText;
        buttonsElement.style.display = "none";
        openSidenav();
        populateEntries();
        entriesElement.style.display = "block";
    }

    function populateEntries() {
        fetch('cookbook_entries.json')
            .then(response => response.json())
            .then(entries => {
                const sections = {};
                entries.forEach(entry => {
                    if (!sections[entry.section]) {
                        sections[entry.section] = [];
                    }
                    sections[entry.section].push(entry);
                });

                for (const [section, entries] of Object.entries(sections)) {
                    const sectionId = section.replace(/\s+/g, '');
                    const sectionContainer = document.createElement("div");
                    sectionContainer.id = sectionId;
                    sectionContainer.classList.add("section");

                    const sectionTitle = document.createElement("h1");
                    sectionTitle.textContent = section;
                    sectionContainer.appendChild(sectionTitle);

                    entries.forEach(entry => {
                        const entryElement = document.createElement("div");
                        entryElement.classList.add("entry-section");

                        const titleElement = document.createElement("h2");
                        titleElement.textContent = entry.title;
                        titleElement.style.cursor = "pointer";
                        entryElement.appendChild(titleElement);

                        const authorElement = document.createElement("p");
                        authorElement.style.color = "white"; // Set author text color to white
                        authorElement.textContent = entry.author;
                        authorElement.style.display = "none";
                        entryElement.appendChild(authorElement);

                        const contentElement = document.createElement("p");
                        contentElement.innerHTML = entry.content.replace(/\n/g, '<br>');
                        contentElement.style.display = "none";
                        entryElement.appendChild(contentElement);

                        const notesContainer = document.createElement("div");
                        notesContainer.style.display = "none";

                        if (entry.notes.length > 0) {
                            const notesToggle = document.createElement("span");
                            notesToggle.textContent = "📝";
                            notesToggle.classList.add("note-icon");
                            notesToggle.addEventListener("click", function() {
                                notesContainer.style.display = notesContainer.style.display === "none" ? "block" : "none";
                            });

                            entry.notes.forEach(note => {
                                const noteAuthorElement = document.createElement("h3");
                                noteAuthorElement.style.color = "white"; // Set note author text color to white
                                noteAuthorElement.textContent = note.author;
                                notesContainer.appendChild(noteAuthorElement);

                                const noteContentElement = document.createElement("p");
                                noteContentElement.textContent = note.content;
                                notesContainer.appendChild(noteContentElement);
                            });

                            entryElement.appendChild(notesToggle);
                        }

                        entryElement.appendChild(notesContainer);

                        titleElement.addEventListener("click", function() {
                            const isHidden = contentElement.style.display === "none";
                            contentElement.style.display = isHidden ? "block" : "none";
                            authorElement.style.display = isHidden ? "block" : "none";
                            notesToggle.style.display = isHidden && entry.notes.length > 0 ? "inline" : "none";
                            if (entry.notes.length > 0) {
                                notesContainer.style.display = "none"; // Ensure notes are hidden initially
                            }
                        });

                        sectionContainer.appendChild(entryElement);
                    });

                    sectionContainer.style.display = "none"; // Hide all sections initially
                    entriesElement.appendChild(sectionContainer);
                }
                setupNavigation();
            })
            .catch(error => console.error('Error loading entries:', error));
    }

    function setupNavigation() {
        const navLinks = sidenavElement.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                textElement.style.display = "none"; // Hide text when a link is clicked
                const sectionId = link.getAttribute("data-section");
                showSection(sectionId);
            });
        });
    }

    function showSection(sectionId) {
        const sections = entriesElement.querySelectorAll(".section");
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });
    }
});
