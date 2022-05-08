const formKeyboard = (query, page = 1, pageCount = 1) => {
  if (pageCount <= 1) {
    return false;
  }

  const firstButton =
    page === 1
      ? null
      : {
          text: '◀️',
          callback_data: `${query}|prev`,
        };

  const currentPageButton = {
    text: `${page}/${pageCount}`,
    callback_data: `${query}|${page}`,
  };

  const lastButton =
    page === pageCount
      ? null
      : {
          text: '▶️',
          callback_data: `${query}|next`,
        };

  const keyboard = [];

  if (firstButton) {
    keyboard.push(firstButton);
  }

  keyboard.push(currentPageButton);

  if (lastButton) {
    keyboard.push(lastButton);
  }

  return keyboard;
};

const escapeString = (str) => {
  return str.replaceAll(/\</g, '');
};

const formatAnswer = (item) => {
  return `<a href="${item.url}">${escapeString(item.title)}</a>\n`;
};

const textAnswer = async (text = '', data = []) => {
  if (!text) return;

  if (!data.length) {
    return `Nothing was found by query <i>${text}</i>`;
  }

  return data.map(formatAnswer).join('');
};

const sortByRelevance = (data, key, query = '') => {
  query = query.toLowerCase();
  const rankedList = data.map((entry) => {
    let points = 0;

    const starts = entry[key]
      .toLowerCase()
      .startsWith(query.toLowerCase());
    const includes = entry[key]
      .toLowerCase()
      .startsWith(query.toLowerCase());

    if (starts) {
      points += 2;
    } else if (includes) {
      points += 1;
    }
    return { ...entry, points };
  });

  return rankedList.sort((a, b) => b.points - a.points);
};

module.exports = {
  textAnswer,
  formKeyboard,
  formatAnswer,
  escapeString,
  sortByRelevance,
};
