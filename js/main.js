function render(file, element_id) {
    const md = window.markdownit({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>'
                } catch (__) { }
            }

            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
        }
    })

    fetch(file)
        .then(response => response.text())
        .then(text => {
            const content = md.render(text)
            const breadcrumb = `<div class='home'><h1><a href='/'>/home/Jeky</a>/articles/${file}</h1></div>`
            document.getElementById(element_id).innerHTML = [breadcrumb, content].join('')
        })
}

function parse_directory(node) {
    return [
        node.root ? '<h1>' : '<ul><li>',
        node.link ? `<a href="${node.link}">` : '',
        node.name,
        node.root ? '</h1><ul>': '',
        node.children.map(parse_directory).join(''),
        node.link ? '</a>' : '',
        node.root ? '' : '</ul>'
    ].join('')
}

function fill_directory(directory_json, element_id) {
    fetch(directory_json)
        .then(response => response.json())
        .then(directory => document.getElementById(element_id).innerHTML = parse_directory(directory))
}