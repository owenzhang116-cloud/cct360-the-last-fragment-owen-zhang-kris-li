// Saved choices belong only to this story, in this browser.
let canSave = true;

function element(id) {
  return document.getElementById(id);
}

function readValue(name) {
  try {
    return localStorage.getItem("lastFragment-" + name);
  } catch (error) {
    canSave = false;
    return null;
  }
}

function writeValue(name, value) {
  try {
    localStorage.setItem("lastFragment-" + name, value);
  } catch (error) {
    canSave = false;
  }
}

let messageRecovered = readValue("messageRecovered") === "true";
let photoRepaired = readValue("photoRepaired") === "true";
let clueA = readValue("clueA") === "true";
let clueB = readValue("clueB") === "true";
let clueC = readValue("clueC") === "true";
let clueD = readValue("clueD") === "true";
let identityChecked = readValue("identityChecked") === "true";
let photoChecked = readValue("photoChecked") === "true";
let visitedMessages = readValue("visitedMessages") === "true";
let visitedPhotos = readValue("visitedPhotos") === "true";
let visitedNotes = readValue("visitedNotes") === "true";
let newMessagesRead = readValue("newMessagesRead") === "true";
let ending = readValue("ending");
if (ending !== "sealed" && ending !== "restored") {
  ending = "";
}

let currentScreen = "home";
let currentNote = 1;
let showingOriginal = false;
let firstClue = "";
let secondClue = "";

function saveProgress() {
  writeValue("messageRecovered", messageRecovered);
  writeValue("photoRepaired", photoRepaired);
  writeValue("clueA", clueA);
  writeValue("clueB", clueB);
  writeValue("clueC", clueC);
  writeValue("clueD", clueD);
  writeValue("identityChecked", identityChecked);
  writeValue("photoChecked", photoChecked);
  writeValue("visitedMessages", visitedMessages);
  writeValue("visitedPhotos", visitedPhotos);
  writeValue("visitedNotes", visitedNotes);
  writeValue("newMessagesRead", newMessagesRead);
  writeValue("ending", ending);
  element("storageWarning").hidden = canSave;
  element("saveStatus").innerHTML = canSave ? "Progress saved on this device" : "Progress kept in this tab";
}

function announce(message) {
  element("feedback").innerHTML = message;
}

function clueCount() {
  let count = 0;
  if (clueA) count = count + 1;
  if (clueB) count = count + 1;
  if (clueC) count = count + 1;
  if (clueD) count = count + 1;
  return count;
}

function connectionCount() {
  let count = 0;
  if (identityChecked) count = count + 1;
  if (photoChecked) count = count + 1;
  return count;
}

// Six screens share the same variables, so exploration order is flexible.
function showScreen(name) {
  if (name === "final" && (!identityChecked || !photoChecked)) {
    announce("Check both evidence connections before making the final decision.");
    return;
  }
  element("home").hidden = true;
  element("messages").hidden = true;
  element("photos").hidden = true;
  element("notes").hidden = true;
  element("evidence").hidden = true;
  element("final").hidden = true;
  element(name).hidden = false;
  currentScreen = name;
  if (name === "messages") {
    visitedMessages = true;
    if (photoRepaired) newMessagesRead = true;
  }
  if (name === "photos") visitedPhotos = true;
  if (name === "notes") visitedNotes = true;
  element("navHome").removeAttribute("aria-current");
  element("navMessages").removeAttribute("aria-current");
  element("navPhotos").removeAttribute("aria-current");
  element("navNotes").removeAttribute("aria-current");
  element("navEvidence").removeAttribute("aria-current");
  if (name === "home") element("navHome").setAttribute("aria-current", "page");
  if (name === "messages") element("navMessages").setAttribute("aria-current", "page");
  if (name === "photos") element("navPhotos").setAttribute("aria-current", "page");
  if (name === "notes") element("navNotes").setAttribute("aria-current", "page");
  if (name === "evidence") element("navEvidence").setAttribute("aria-current", "page");
  announce("");
  saveProgress();
  render();
  element(name + "Title").focus();
}

function render() {
  element("homeProgress").innerHTML = clueCount() + " of 4 clues collected";
  element("homeConnections").innerHTML = connectionCount() + " of 2 connections checked";
  element("evidenceCount").innerHTML = clueCount() + " of 4 clues collected";
  element("homeFinal").hidden = !identityChecked || !photoChecked;
  element("homeFinal").innerHTML = ending ? "View your ending" : "Open the final decision";
  element("homeStatus").innerHTML = "Explore in any order. You can return to anything you have already opened.";
  if (clueCount() === 4) element("homeStatus").innerHTML = "All four clues are collected. Check their connections on the evidence board.";
  if (identityChecked && photoChecked) element("homeStatus").innerHTML = "Both connections are checked. The final fragment is waiting.";
  if (ending === "sealed") element("homeStatus").innerHTML = "The photo is sealed. The sender is disconnected. Your evidence remains in the archive.";
  if (ending === "restored") element("homeStatus").innerHTML = "The photo is complete. The contact has a different name now.";

  element("messagesSummary").innerHTML = visitedMessages ? "Opened / one withdrawn message" : "One withdrawn message";
  if (messageRecovered) element("messagesSummary").innerHTML = "Withdrawn message recovered";
  if (photoRepaired && !newMessagesRead) element("messagesSummary").innerHTML = "2 new messages after the repair";
  element("unreadBadge").hidden = !photoRepaired || newMessagesRead || ending !== "";
  element("photosSummary").innerHTML = visitedPhotos ? "Opened / still damaged" : "One damaged photograph";
  if (photoRepaired) element("photosSummary").innerHTML = "Partly restored / figure moved";
  if (ending === "sealed") element("photosSummary").innerHTML = "Photo sealed";
  if (ending === "restored") element("photosSummary").innerHTML = "Restoration complete";
  element("notesSummary").innerHTML = visitedNotes ? "Opened / three saved entries" : "Three saved entries";
  element("evidenceSummary").innerHTML = connectionCount() + " of 2 connections checked";

  element("withdrawnMessage").innerHTML = messageRecovered ? "Finish the last piece and I can get out." : "This message was withdrawn.";
  element("recoverMessage").disabled = messageRecovered;
  element("recoverMessage").innerHTML = messageRecovered ? "Message recovered" : "Recover withdrawn message";
  element("collectA").hidden = !messageRecovered;
  element("collectA").disabled = clueA;
  element("collectA").innerHTML = clueA ? "Evidence A collected" : "Collect this message";
  element("newMessages").hidden = !photoRepaired;
  element("contactName").innerHTML = ending === "restored" ? "You" : "Alex";
  element("contactInitial").innerHTML = ending === "restored" ? "Y" : "A";
  element("contactStatus").innerHTML = ending === "sealed" ? "Disconnected" : "Online";
  element("chatObservation").innerHTML = photoRepaired ? "The sender replied as soon as the photo changed. How did they know?" : "Why was that message withdrawn?";
  if (ending === "sealed") element("chatObservation").innerHTML = "The connection is closed. These messages are now part of the sealed archive.";
  if (ending === "restored") element("chatObservation").innerHTML = "The messages are the same. The name above them is yours.";

  renderPhoto();
  renderNote();
  renderEvidence();
  renderEnding();
  element("storageWarning").hidden = canSave;
  element("saveStatus").innerHTML = canSave ? "Progress saves on this device" : "Progress kept in this tab";
}

function recoverMessage() {
  if (messageRecovered) return;
  messageRecovered = true;
  saveProgress();
  render();
  announce("Withdrawn message recovered. You can collect it as evidence.");
}

function repairPhoto() {
  if (photoRepaired || ending !== "") return;
  photoRepaired = true;
  showingOriginal = false;
  newMessagesRead = false;
  saveProgress();
  render();
  announce("Part of the photo is restored. The figure moved. Two new messages have arrived.");
}

function renderPhoto() {
  let source = "images/hallway-a.png";
  let description = "An apartment hallway with a small dark figure at its far end";
  let version = "Original photograph";
  if (photoRepaired && !showingOriginal) {
    source = "images/hallway-b.png";
    description = "The identical hallway with the dark figure now standing halfway toward the camera";
    version = "Partly restored photograph";
  }
  if (ending === "restored") {
    source = "images/hallway-c.png";
    description = "The same hallway with the figure's shadowed head and shoulders now directly in front of the camera";
    version = "Fully restored photograph";
  }
  element("hallwayPhoto").src = source;
  element("hallwayPhoto").alt = description;
  element("photoVersion").innerHTML = version;
  element("firstPatch").hidden = (photoRepaired && !showingOriginal) || ending === "restored";
  element("lastPatch").hidden = ending === "restored";
  element("photoComparison").hidden = !photoRepaired || ending === "restored";
  element("viewOriginal").setAttribute("aria-pressed", showingOriginal);
  element("viewRepaired").setAttribute("aria-pressed", !showingOriginal);
  element("repairPhoto").disabled = photoRepaired || ending !== "";
  element("repairPhoto").innerHTML = photoRepaired ? "Partial restoration complete" : "Restore part of the photo";
  element("photoDescription").innerHTML = photoRepaired ? "The corridor is the same. Look at the figure's position in each version." : "A damaged photograph. Something is standing at the far end.";
  element("photoObservation").hidden = !photoRepaired || ending === "restored";
  element("collectC").hidden = !photoRepaired;
  element("collectC").disabled = clueC;
  element("collectC").innerHTML = clueC ? "Evidence C collected" : "Collect this change";
  element("photoLock").innerHTML = "The last fragment will remain damaged until you review the evidence.";
  if (ending === "sealed") {
    element("repairPhoto").innerHTML = "Photo sealed";
    element("photoLock").innerHTML = "This photo is sealed. You can still compare the archived versions.";
  }
  if (ending === "restored") {
    element("repairPhoto").innerHTML = "Restoration complete";
    element("photoDescription").innerHTML = "There is no damaged fragment left. There is no distance left, either.";
    element("photoLock").innerHTML = "This is the final image. Return to your ending to see what changed.";
  }
}

function selectNote(number) {
  currentNote = number;
  renderNote();
}

function renderNote() {
  element("noteOne").setAttribute("aria-pressed", currentNote === 1);
  element("noteTwo").setAttribute("aria-pressed", currentNote === 2);
  element("noteThree").setAttribute("aria-pressed", currentNote === 3);
  element("collectNote").hidden = currentNote === 2;
  if (currentNote === 1) {
    element("noteDate").innerHTML = "OCTOBER 12";
    element("noteTitle").innerHTML = "He never sent it.";
    element("noteText").innerHTML = "Sam asked me to restore a photo. I called him. He said he had never sent those messages. It was his name, but it wasn't him.";
    element("collectNote").disabled = clueB;
    element("collectNote").innerHTML = clueB ? "Evidence B collected" : "Collect this warning";
    element("noteHint").innerHTML = "A familiar name can belong to an unfamiliar sender.";
  } else if (currentNote === 2) {
    element("noteDate").innerHTML = "OCTOBER 13";
    element("noteTitle").innerHTML = "It wasn't becoming clearer.";
    element("noteText").innerHTML = "I compared the two versions. Same doors. Same lights. Same camera position. I thought I was making the picture clearer. The person inside it was walking toward me.";
    element("noteHint").innerHTML = "Look for the same change in the photo archive. This entry adds context; the photo itself is the evidence.";
  } else {
    element("noteDate").innerHTML = "OCTOBER 14";
    element("noteTitle").innerHTML = "Leave the last piece alone.";
    element("noteText").innerHTML = "I stopped restoring the photo and left the last damaged fragment untouched. The figure stopped coming closer. Do not finish that last piece. Close the connection. Keep the warning.";
    element("collectNote").disabled = clueD;
    element("collectNote").innerHTML = clueD ? "Evidence D collected" : "Collect this warning";
    element("noteHint").innerHTML = "Stopping the repair seems to have stopped the movement.";
  }
}

function collectClue(letter) {
  if (letter === "A" && messageRecovered) clueA = true;
  else if (letter === "B" && currentNote === 1) clueB = true;
  else if (letter === "C" && photoRepaired) clueC = true;
  else if (letter === "D" && currentNote === 3) clueD = true;
  else return;
  saveProgress();
  render();
  announce("Evidence " + letter + " added to the board. " + clueCount() + " of 4 clues collected.");
}

function hasClue(letter) {
  if (letter === "A") return clueA;
  if (letter === "B") return clueB;
  if (letter === "C") return clueC;
  if (letter === "D") return clueD;
  return false;
}

function selectClue(letter) {
  if (!hasClue(letter)) return;
  if (firstClue === letter) {
    firstClue = secondClue;
    secondClue = "";
  } else if (secondClue === letter) {
    secondClue = "";
  } else if (firstClue === "") {
    firstClue = letter;
  } else {
    secondClue = letter;
  }
  element("matchFeedback").innerHTML = "";
  renderEvidence();
}

function renderEvidence() {
  element("clueA").disabled = !clueA;
  element("clueB").disabled = !clueB;
  element("clueC").disabled = !clueC;
  element("clueD").disabled = !clueD;
  element("hintA").hidden = clueA;
  element("hintB").hidden = clueB;
  element("hintC").hidden = clueC;
  element("hintD").hidden = clueD;
  element("clueAText").innerHTML = clueA ? 'The sender named Alex asks for the photo to be restored: "Finish the last piece and I can get out."' : "A message is missing.";
  element("clueBText").innerHTML = clueB ? "Someone made the same request using Sam's name. The real Sam denied sending it." : "The previous owner knew something.";
  element("clueCText").innerHTML = clueC ? "The partial repair brought the figure closer. The hallway and camera position stayed the same." : "The photograph needs a closer look.";
  element("clueDText").innerHTML = clueD ? "The previous owner left the final fragment damaged. The figure stopped moving closer." : "An unfinished warning remains.";
  element("clueA").setAttribute("aria-pressed", firstClue === "A" || secondClue === "A");
  element("clueB").setAttribute("aria-pressed", firstClue === "B" || secondClue === "B");
  element("clueC").setAttribute("aria-pressed", firstClue === "C" || secondClue === "C");
  element("clueD").setAttribute("aria-pressed", firstClue === "D" || secondClue === "D");
  element("selectedClues").innerHTML = "Select two clues.";
  if (firstClue) element("selectedClues").innerHTML = "Selected: " + firstClue + ". Choose one more clue.";
  if (secondClue) element("selectedClues").innerHTML = "Selected: " + firstClue + " + " + secondClue;
  element("checkClues").disabled = !firstClue || !secondClue;
  element("identityConnection").hidden = !identityChecked;
  element("photoConnection").hidden = !photoChecked;
  element("goToFinal").disabled = !identityChecked || !photoChecked;
  element("goToFinal").innerHTML = ending ? "View your ending" : "Make the final decision";
  element("finalHint").innerHTML = connectionCount() + " of 2 connections checked. Check both before making the final decision.";
  if (identityChecked && photoChecked) element("finalHint").innerHTML = "Both questions are answered. You can now decide what to do with the last fragment.";
}

// Both orders of a correct pair work. Other pairs do not erase progress.
function checkConnection() {
  if (!firstClue || !secondClue) return;
  if ((firstClue === "A" && secondClue === "B") || (firstClue === "B" && secondClue === "A")) {
    identityChecked = true;
    element("matchFeedback").innerHTML = "Connection found: the request uses borrowed names. Read your conclusion below.";
  } else if ((firstClue === "C" && secondClue === "D") || (firstClue === "D" && secondClue === "C")) {
    photoChecked = true;
    element("matchFeedback").innerHTML = "Connection found: restoring the photo brings the figure closer. Read your conclusion below.";
  } else {
    element("matchFeedback").innerHTML = "These clues do not answer the same question. Pair the two clues about the sender, or the two about the photo. Try another pair; nothing has been lost.";
  }
  firstClue = "";
  secondClue = "";
  saveProgress();
  render();
}

function chooseEnding(choice) {
  if (!identityChecked || !photoChecked || ending !== "") return;
  ending = choice;
  saveProgress();
  render();
  element("endingTitle").setAttribute("tabindex", "-1");
  element("endingTitle").focus();
}

function renderEnding() {
  element("decisionPanel").hidden = ending !== "";
  element("endingPanel").hidden = ending === "";
  element("loopMessages").hidden = ending !== "restored";
  element("finalPatch").hidden = ending === "restored";
  element("finalPhoto").src = ending === "restored" ? "images/hallway-c.png" : "images/hallway-b.png";
  element("finalPhoto").alt = ending === "restored" ? "The shadowed figure now directly in front of the camera" : "The figure halfway down the hallway, with the last fragment still damaged";
  element("finalTitle").innerHTML = "One piece left.";
  element("finalContact").innerHTML = "Alex is online.";
  if (ending === "sealed") {
    element("finalTitle").innerHTML = "The line goes quiet.";
    element("finalContact").innerHTML = "Alex / Disconnected";
    element("endingLabel").innerHTML = "ENDING 01 / SEALED";
    element("endingTitle").innerHTML = "You kept the warning.";
    element("endingText").innerHTML = "You stopped the repair and sealed the photograph. The figure stays where it was. The messages, notes and evidence remain in the archive. Alex is still missing, but you have stopped something using his name from coming through this phone.";
    element("endingLastLine").innerHTML = "Some things should stay unfinished.";
  } else if (ending === "restored") {
    element("finalTitle").innerHTML = "The name has changed.";
    element("finalContact").innerHTML = "You / Online";
    element("endingLabel").innerHTML = "ENDING 02 / RESTORED";
    element("endingTitle").innerHTML = "It has someone new to be.";
    element("endingText").innerHTML = "You completed the last fragment. The figure is at the camera. The contact once named Alex now carries your name. A new conversation is already waiting.";
    element("endingLastLine").innerHTML = "Next time, it will ask for help using your name.";
  }
}

function openPhoto() {
  element("zoomPhoto").src = element("hallwayPhoto").src;
  element("zoomPhoto").alt = element("hallwayPhoto").alt;
  element("zoomFirstPatch").hidden = element("firstPatch").hidden;
  element("zoomLastPatch").hidden = element("lastPatch").hidden;
  element("zoomCaption").innerHTML = element("photoVersion").innerHTML;
  element("photoDialog").showModal();
}

function requestRestart() {
  element("restartPrompt").hidden = false;
  element("cancelRestart").focus();
}

function cancelRestart() {
  element("restartPrompt").hidden = true;
  element("restart").focus();
}

function restartCase() {
  element("restartPrompt").hidden = true;
  messageRecovered = false;
  photoRepaired = false;
  clueA = false;
  clueB = false;
  clueC = false;
  clueD = false;
  identityChecked = false;
  photoChecked = false;
  visitedMessages = false;
  visitedPhotos = false;
  visitedNotes = false;
  newMessagesRead = false;
  ending = "";
  currentNote = 1;
  showingOriginal = false;
  firstClue = "";
  secondClue = "";
  element("matchFeedback").innerHTML = "";
  saveProgress();
  showScreen("home");
  announce("New case started. The phone has been reset.");
}

function openMessages() { showScreen("messages"); }
function openPhotos() { showScreen("photos"); }
function openNotes() { showScreen("notes"); }
function openEvidence() { showScreen("evidence"); }
function openHome() { showScreen("home"); }
function openFinal() { showScreen("final"); }

element("openMessages").addEventListener("click", openMessages);
element("openPhotos").addEventListener("click", openPhotos);
element("openNotes").addEventListener("click", openNotes);
element("openEvidence").addEventListener("click", openEvidence);
element("navHome").addEventListener("click", openHome);
element("navMessages").addEventListener("click", openMessages);
element("navPhotos").addEventListener("click", openPhotos);
element("navNotes").addEventListener("click", openNotes);
element("navEvidence").addEventListener("click", openEvidence);
element("chatToPhoto").addEventListener("click", openPhotos);
element("photoToMessages").addEventListener("click", openMessages);
element("photoToNotes").addEventListener("click", openNotes);
element("notesToEvidence").addEventListener("click", openEvidence);
element("homeFinal").addEventListener("click", openFinal);
element("goToFinal").addEventListener("click", openFinal);
element("backToEvidence").addEventListener("click", openEvidence);
element("endingHome").addEventListener("click", openHome);
element("recoverMessage").addEventListener("click", recoverMessage);
element("repairPhoto").addEventListener("click", repairPhoto);
element("collectA").addEventListener("click", function () { collectClue("A"); });
element("collectC").addEventListener("click", function () { collectClue("C"); });
element("collectNote").addEventListener("click", function () {
  if (currentNote === 1) collectClue("B");
  if (currentNote === 3) collectClue("D");
});
element("noteOne").addEventListener("click", function () { selectNote(1); });
element("noteTwo").addEventListener("click", function () { selectNote(2); });
element("noteThree").addEventListener("click", function () { selectNote(3); });
element("viewOriginal").addEventListener("click", function () { showingOriginal = true; renderPhoto(); });
element("viewRepaired").addEventListener("click", function () { showingOriginal = false; renderPhoto(); });
element("clueA").addEventListener("click", function () { selectClue("A"); });
element("clueB").addEventListener("click", function () { selectClue("B"); });
element("clueC").addEventListener("click", function () { selectClue("C"); });
element("clueD").addEventListener("click", function () { selectClue("D"); });
element("checkClues").addEventListener("click", checkConnection);
element("hintA").addEventListener("click", openMessages);
element("hintB").addEventListener("click", function () { selectNote(1); openNotes(); });
element("hintC").addEventListener("click", openPhotos);
element("hintD").addEventListener("click", function () { selectNote(3); openNotes(); });
element("sealPhoto").addEventListener("click", function () { chooseEnding("sealed"); });
element("finishPhoto").addEventListener("click", function () { chooseEnding("restored"); });
element("enlargePhoto").addEventListener("click", openPhoto);
element("closePhoto").addEventListener("click", function () { element("photoDialog").close(); });
element("restart").addEventListener("click", requestRestart);
element("endingRestart").addEventListener("click", requestRestart);
element("cancelRestart").addEventListener("click", cancelRestart);
element("confirmRestart").addEventListener("click", restartCase);

render();
