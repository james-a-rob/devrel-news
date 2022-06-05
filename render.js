const story = (storyData) => {
    return `<div>${storyData.title}</div>`
}
const head = () => { }

const render = () => {
    const storiesData = [{
        title: "blah title"
    }, {
        title: "blah title"
    }]
    return `
    <body>
        <div>${1 + 1}</div>
        ${storiesData.map((storyData) => {
        return story(storyData)
    }).join('')}
    </body>
    `
}

console.log(render());