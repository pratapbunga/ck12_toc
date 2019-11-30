// Your JS code goes here
import { getAllContentsOfBook } from "./services/api.js";

// Onload
(async () => {
  // Calling API's onLoad
  let { bookDetails, allChapterContents } = await getAllContentsOfBook("maths");

  /****** Root Element - Build content and Append to root || START  ******/
  const app = document.getElementById("root");
  const accordionWrapper = document.createElement("div");
  accordionWrapper.setAttribute("class", "accordionWrapper");

  // Iterate through book details to Build Accordian
  bookDetails.forEach((chapter, index) => {
    const accordionItem = document.createElement("div");
    accordionItem.setAttribute(
      "class",
      index === 0 ? "accordionItem open" : "accordionItem close"
    );

    const heading = accordianHeading(chapter, index); // Heading
    const content = accordianContent(chapter, index, allChapterContents); // Content

    // Append head and content
    accordionItem.appendChild(heading);
    accordionItem.appendChild(content);
    accordionWrapper.appendChild(accordionItem);
  });
  app.appendChild(accordionWrapper);
  /****** Root Element - Build content and Append to root || END  ******/
  /********************************************************************/

  /* Event Listener for Accordian Click  - Start */
  var accItem = document.getElementsByClassName("accordionItem");
  var accHD = document.getElementsByClassName("accordionItemHeading");

  for (let i = 0; i < accHD.length; i++) {
    accHD[i].addEventListener("click", toggleItem, false);
  }

  function toggleItem() {
    var itemClass = this.parentNode.className;
    for (let i = 0; i < accItem.length; i++) {
      accItem[i].className = "accordionItem close";
    }
    if (itemClass == "accordionItem close") {
      this.parentNode.className = "accordionItem open";
    }
  }
  /* Event Listener for Accordian Click  - End */

  /* Build Accordian Heading  - Start */
  function accordianHeading(chapter, index) {
    const heading = document.createElement("div");
    heading.setAttribute("class", "accordionItemHeading");
    const headTitle = document.createElement("span");
    headTitle.setAttribute("class", "accordionItemTitle");
    headTitle.textContent = index + 1 + ". " + chapter.title;
    const chapterStatus = document.createElement("div");
    chapterStatus.setAttribute("class", "accordionItemStatus");
    chapterStatus.textContent =
      chapter.childrenCount > 0
        ? chapter.completeCount + " / " + chapter.childrenCount
        : chapter.status === "COMPLETE"
        ? "1 / 1"
        : "0 / 1";
    const clearFix = document.createElement("div");
    clearFix.setAttribute("style", "clear: both;");

    // appened title & Status & Clearfix in HEADING
    heading.appendChild(headTitle);
    heading.appendChild(chapterStatus);
    heading.appendChild(clearFix);

    return heading;
  }
  /* Build Accordian Heading  - End */

  /* Build Accordian Content  - Start */
  function accordianContent(chapter, chapterIndex, allChapterContents) {
    const content = document.createElement("div"); // Content
    content.setAttribute("class", "accordionItemContent");
    const list = document.createElement("ul");
    list.setAttribute("class", "listGroup");
    const sectionDetails = allChapterContents[chapter.id];
    console.log(sectionDetails);
    sectionDetails.forEach((lesson, index) => {
      const listItem = document.createElement("li");
      const lessonIndex = chapterIndex + 1 + "." + (index + 1) + "  ";
      const status = lesson.status === "COMPLETE" ? "✅  " : "☑️  ";
      listItem.setAttribute("class", "listItem");
      listItem.textContent = status + lessonIndex + lesson.title;
      list.appendChild(listItem);
    });
    content.appendChild(list);

    return content;
  }
  /* Build Accordian Content  - End */
})();
