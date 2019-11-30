/****** SERVICES ******/

/****** getBookDetails -  Will Fetch book details ||  method - get ******/
export async function getBookDetails(bookId) {
  try {
    const response = await fetch(`/api/book/${bookId}`);
    const myJson = await response.json();
    return myJson.response;
  } catch (error) {
    console.error(error);
  }
}

/****** getSectionDetails : Will Fetch lesson details || method - get ******/
export async function getSectionDetails(bookId, sectionId) {
  try {
    const response = await fetch(`/api/book/${bookId}/section/${sectionId}`);
    const myJson = await response.json();
    return myJson.response;
  } catch (error) {
    console.error(error);
  }
}

/****** getAllContentsOfBook : Fetch all book details  ******/
export async function getAllContentsOfBook(bookId) {
  let allChapterContents = {}; // hold all chapters(or sections) into Object
  let bookDetails = await getBookDetails(bookId);
  //sort chapters
  bookDetails.sort((a, b) => a.sequenceNO - b.sequenceNO);

  // Get sections for each chapter
  for (let chapter of bookDetails) {
    let chapterDetails;
    if (chapter.childrenCount > 0 && chapter.type === "chapter") {
      const resp = await getSectionDetails(bookId, chapter.id);
      chapterDetails = resp[chapter.id].sort(
        (a, b) => a.sequenceNO - b.sequenceNO
      ); // Sort
      allChapterContents[chapter.id] = chapterDetails;
    } else {
      allChapterContents[chapter.id] = [chapter];
    }
  }
  return { bookDetails, allChapterContents };
}
