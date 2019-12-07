// Your JS code goes here
import { getBookDetails, getSectionDetails } from "./services/api.js";

// Onload
(async () => {
  // Calling API's onLoad
  let bookDetails = await getBookDetails("maths");
  bookDetails.sort((a, b) => a.sequenceNO - b.sequenceNO);
  let allChapterContents = { bookDetails };

  /********************************************************************/
  /****** Root Element - Build content and Append to root || START  ***/
  const app = document.getElementById("root");
  const accordionWrapper = document.createElement("div");
  accordionWrapper.setAttribute("class", "accordionWrapper");

  // Iterate through book details to Build Accordian
  for (let [index, chapter] of bookDetails.entries()) {
    const accordionItem = document.createElement("div");
    let content;

    // Call section API for 1st section
    if (index === 0) {
      //Paint content
      const resp = await getSectionDetails("maths", chapter.id);
      const sectionDetails = resp[chapter.id].sort(
        (a, b) => a.sequenceNO - b.sequenceNO
      ); // Sort
      allChapterContents[chapter.id] = sectionDetails;
      content = accordianContent(chapter, index, sectionDetails); // Content
    }

    accordionItem.setAttribute(
      "class",
      index === 0 ? "accordionItem open" : "accordionItem close"
    );

    const heading = accordianHeading(chapter, index); // Heading

    // Append head and content
    accordionItem.appendChild(heading);
    index === 0 ? accordionItem.appendChild(content) : "";
    accordionWrapper.appendChild(accordionItem);
  }

  app.appendChild(accordionWrapper);
  /****** Root Element - Build content and Append to root || END  ******/
  /********************************************************************/

  /**
   * Event Delegation from the Root Element | <div id="root"></div>
   * Listens for the click on Accordian Header
   * @param {} event
   */

  app.addEventListener("click", toggleItemFromRoot);

  async function toggleItemFromRoot(event) {
    var accItem = document.getElementsByClassName("accordionItem");
    if (event.target.className !== "accordionItemHeading") {
      return;
    } else {
      var itemClass = event.target.parentNode.className;
      var chapterId = parseInt(event.target.attributes["data-id"].value);
      var sectionCount = parseInt(event.target.attributes["count"].value);
      var chapterIndex = parseInt(event.target.attributes["index"].value);

      for (let i = 0; i < accItem.length; i++) {
        accItem[i].className = "accordionItem close";
      }

      if (itemClass === "accordionItem close") {
        let sectionDetails = [];
        if (!allChapterContents[chapterId]) {
          if (sectionCount > 0) {
            const resp = await getSectionDetails("maths", chapterId);
            sectionDetails = resp[chapterId].sort(
              (a, b) => a.sequenceNO - b.sequenceNO
            ); // Sort
            allChapterContents[chapterId] = sectionDetails;
          } else {
            sectionDetails = [allChapterContents.bookDetails[chapterIndex - 1]];
            allChapterContents[chapterId] = sectionDetails;
          }
          // sectionDetails = allChapterContents[chapterId];

          // Paint content
          const content = accordianContent("", chapterIndex, sectionDetails); // Content
          event.target.parentNode.appendChild(content);
        } else {
          sectionDetails = allChapterContents[chapterId];
        }

        event.target.parentNode.className = "accordionItem open";
      }
    }
  }

  /* Build Accordian Heading  - Start */
  function accordianHeading(chapter, index) {
    const heading = document.createElement("div");
    heading.setAttribute("class", "accordionItemHeading");
    heading.setAttribute("data-id", chapter.id);
    heading.setAttribute("count", chapter.childrenCount);
    heading.setAttribute("index", chapter.sequenceNO);

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
  function accordianContent(chapter, chapterIndex, sectionDetails) {
    // allChapterContents) {
    const content = document.createElement("div"); // Content
    content.setAttribute("class", "accordionItemContent");
    const list = document.createElement("ul");
    list.setAttribute("class", "listGroup");
    // const sectionDetails = allChapterContents[chapter.id];

    console.log(sectionDetails);
    sectionDetails.forEach((lesson, index) => {
      const listItem = document.createElement("li");
      const lessonIndex = chapterIndex + "." + (index + 1) + "  ";
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
