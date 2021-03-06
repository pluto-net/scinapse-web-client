import { Paper } from '../model/paper';
import { PaperAuthor } from '../model/author';
import { ConferenceInstance } from '../model/conferenceInstance';
import { Journal } from '../model/journal';
import { PaperSource } from '../model/paperSource';
import { Collection } from '../model/collection';
import { Member } from '../model/member';
import { Author } from '../model/author/author';

export function getIdSafePaperAuthor(author: PaperAuthor): PaperAuthor {
  return {
    ...author,
    id: String(author.id),
    affiliation: author.affiliation ? { ...author.affiliation, id: String(author.affiliation.id) } : null,
  };
}

export function getSafeAuthor(author: Author): Author {
  return {
    ...author,
    id: String(author.id),
    lastKnownAffiliation: author.lastKnownAffiliation
      ? { ...author.lastKnownAffiliation, id: String(author.lastKnownAffiliation.id) }
      : undefined,
    topPapers: author.topPapers.map(getIdSafePaper),
    fosList: author.fosList.map(fos => ({ ...fos, id: String(fos.id) })),
  };
}

function getIdSafeConferenceInstance(conferenceInstance: ConferenceInstance | null) {
  if (!conferenceInstance) return null;

  return {
    ...conferenceInstance,
    id: String(conferenceInstance.id),
    conferenceSeries: conferenceInstance.conferenceSeries
      ? {
          ...conferenceInstance.conferenceSeries,
          id: String(conferenceInstance.conferenceSeries.id),
        }
      : null,
  };
}

export function getIdSafeJournal(journal: Journal | null) {
  if (!journal) return null;

  return {
    ...journal,
    id: String(journal.id),
    fosList: journal.fosList ? journal.fosList.map(fos => ({ ...fos, id: String(fos.id) })) : [],
  };
}

function getIdSafePaperSource(paperSource: PaperSource): PaperSource {
  return {
    ...paperSource,
    paperId: String(paperSource.paperId),
  };
}

export function getSafeMember(member: Member): Member {
  return {
    ...member,
    authorId: String(member.authorId),
  };
}

export function getSafeCollection(collection: Collection): Collection {
  return {
    ...collection,
    createdBy: getSafeMember(collection.createdBy),
  };
}

export function getIdSafePaper(paper: Paper): Paper {
  return {
    ...paper,
    id: String(paper.id),
    fosList: paper.fosList.map(fos => ({ ...fos, id: String(fos.id) })),
    authors: paper.authors.map(getIdSafePaperAuthor),
    journal: getIdSafeJournal(paper.journal),
    conferenceInstance: getIdSafeConferenceInstance(paper.conferenceInstance),
    urls: paper.urls.map(getIdSafePaperSource),
  };
}
