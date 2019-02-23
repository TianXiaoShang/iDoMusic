export class _creatGridData {
    constructor(url, count, title, name, id, showPlayCount, showTitle, showCreatorIcon,type) {
        this.imageUrl = url;
        this.playCount = count;
        this.title = title;
        this.titleName = name;
        this.id = id;
        this.showPlayCount = showPlayCount;
        this.showTitle = showTitle;
        this.showCreatorIcon = showCreatorIcon;
        this.type=type
    }
}

export class _creatListData {
    constructor(url, name, album, id, type) {
        this.imageUrl = url;
        this.name = name;
        this.album = album;
        this.id = id;
        this.type = type
    }
}

export function filterSinger(singer,alboum){
    var singerArr = []
    singer.forEach((item) => {
        singerArr.push(item.name)
    })
    var str = singerArr.join('/') + ' - ' + alboum
    return str
}

export const DATA_TYPE = ["Song",'Singer','Mix']


// export default function _creatGridData(data, url, count, title, name, id, showPlayCount = false, showCreatorIcon = false, showTitle = false) {
//     var newData = [];
//     var nameArr = [];
//     var _arguments = arguments
//     console.log(arguments)
//     newData.forEach.call(arguments, ((item, index) => {
//         if (typeof item == 'string' && item.indexOf('.') !== -1) {
//             var temp = item.split('.')
//             temp.push(index)
//         }
//     }))

//     data.forEach((item, index) => {

//         // getDetail(item, temp)
//         newData.push(new _creatGridData(item[url], item[count], item['creator.nickname'], item[name], item[id], showPlayCount, showCreatorIcon, showTitle))
//     })
//     console.log(newData)
//     return newData;
// }

// function getDetail(item, temp) {
//     console.log(temp)

// }

