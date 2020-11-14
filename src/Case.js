//Alex Redko
//Ver 3.1.4
export class Case {
    /*
    Конструктор класса
    Создание дела при пустом вызове и получение дела при передачи id
    @param - id (String or Null) - UUID дела
    @result - Class Case (Object) - информация по делу
    */
    constructor(id = 'Создано автоматически', prjType, resp = context.UserId) {
        if (/........-....-....-....-............/.test(id)) {
            this.id = id;
            this.tabs = [];
            this.caseInfo = this.getinfo();
            this.caseBlocks = this.getMainBlocks();
            this.getAllTabBlocks();
            this.Error = {};
            this.Error.message = null;
        } else {
            let rID = '';
            let reqPT = {"Name": prjType};
            let resPT = fetch({
                url: '/api/ProjectTypes/GetProjectTypes',
                method: 'POST',
                body: JSON.stringify(reqPT),
                headers: {'Content-Type': 'application/json'}
            });
            if (/........-....-....-....-............/.test(resp)) {
                rID = resp;
            } else {
                let reqR = {
                    "UserType": "User",
                    "NameString": resp
                };
                let resR = fetch({
                    url: '/api/Users/GetUsers',
                    method: 'POST',
                    body: JSON.stringify(reqR),
                    headers: {'Content-Type': 'application/json'}
                });
                if (JSON.parse(resR.body).Result.length !== 0) {
                    rID = JSON.parse(resR.body).Result[0].Id;
                } else {
                    let temp = resp.split(' ');
                    reqR.NameString = temp[1]+' '+temp[0];
                    let resR2 = fetch({
                        url: '/api/Users/GetUsers',
                        method: 'POST',
                        body: JSON.stringify(reqR),
                        headers: {'Content-Type': 'application/json'}
                    });
                    rID = JSON.parse(resR2.body).Result[0].Id;
                }
                
            }
            let newCase = {
                "Name": id,
                "Responsible":{"Id": rID},
                "ProjectType":{"Id": JSON.parse(resPT.body).Result[0].Id}
            };
            let resC = fetch({
                url: '/api/projects/CreateProject',
                method: 'POST',
                body: JSON.stringify(newCase),
                headers: {'Content-Type': 'application/json'}
            });
            if (resC.status !== 200) {
                this.Error = resC;
            } else {
                let delo = JSON.parse(resC.body);
                this.id = delo.Result.Id;
                this.tabs = [];
                this.caseInfo = this.getinfo();
                this.caseBlocks = this.getMainBlocks();
                this.getAllTabBlocks();
                this.Error = {};
                this.Error.message = null;
            }
        }
        this.fixCalculationFormulaBug()//-----------<<Фикс бага записи карточки с формулами с делением на 0
    }

    //Функция исправления бага с фиксацией проблем с полями с типом "Формула" где есть деление на 0 или null
    fixCalculationFormulaBug() {
        this.caseBlocks.Blocks.forEach((db, nb) => {
            db.Lines.forEach((dl, nl) => {
                dl.Values.forEach((dv, nv) => {
                    if (dv.Value && dv.Value.CalculationFormulaId && dv.Value.Result === null) {
                        console.log('Нашли проблемную формулу');
                        console.log(JSON.stringify(dv));
                        dv.Value.Result = 0;
                    }
                });
            });
        });
    }

    /*
    Перенос блоков из другого дела
    (работает при соответствии блоков в двух карточках)
    @param perentDelo(Object class 'Case') - объект класса 'Case'
    @param name(String) - название блока или части с первого символа
    @result Null
    */
    cloneEqBlocks(perentDelo, name) {
        let blocks = [];
        let perentDeloCopy = JSON.parse(JSON.stringify(perentDelo));
        perentDeloCopy.caseBlocks.Blocks.forEach(i => {
            if (i.Name.indexOf(name) === 0) {
                delete i.Id;
                i.Lines.forEach(l => {
                    delete l.Id;
                });
                blocks.push(i);
            } 
        });
        let temp_bloks = this.caseBlocks.Blocks.concat(blocks);
        this.caseBlocks.Blocks = temp_bloks;
    }

    /*
    Получение связанных дел
    @param Null
    @result Array - массив со связанными делами
    */
    getRelCases() {
        let res = fetch({
            url: '/api/RelatedObjects/GetRelatedObjects/' + this.caseInfo.Id,
            method: 'GET'
        });
        return JSON.parse(res.body).Result;
    }

    /*
    Добавление связанных дел
    @param arr(Array or String) - массив или строка с id дела для добавления
    @result Null
    */
    setRelCases(arr) {
        let resp = fetch({
            url: '/api/RelatedObjects/GetRelatedObjects/' + this.caseInfo.Id,
            method: 'GET'
        });
        let temp_arr = JSON.parse(resp.body).Result;
        let typeobject = {}.toString.call(arr);
        if (typeobject === "[object Array]") {
            arr.forEach(i => {
                temp_arr.push({
                    "Id": i,
                    "Type": "Project"
                    });
            });
        } else {
                temp_arr.push({
                    "Id": arr,
                    "Type": "Project"
                    });
        };
        let body = {
            "Id": this.caseInfo.Id,
            "Type": "ProjectToProjects",
            "RelatedObjects": temp_arr
        }
        let res = fetch({
            url: '/api/RelatedObjects/SaveRelatedObjects',
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
    }

    /*
    Получение ссылки на себяя же
    @param Null
    @result Object - Id и Name для записи в поле "Объект -> Дело"
    */
    getSelf() {
        let self = {};
        self.Id = this.caseInfo.Id;
        self.Name = this.caseInfo.Name;
        return self;
    }

    /*
    Получение имени дела
    @param Null
    @result String - название дела
    */
    getName() {
        return this.caseInfo.Name;
    }

    /*
    Запись имени дела
    @param name(String) - название дела
    @result Undefined
    */
    setName(name) {
        this.caseInfo.Name = name;
    }

    /*
    Получение имени стадии
    @param Null
    @result String - название стадии
    */
    getStage() {
        return this.caseInfo.Stage.Name;
    }

    /*
    Смена стадии
    @param name(String) - название стадии
    @result Undefined
    */
    setStage(name) {
        let stObj = {};
        let find = false;
        let res = fetch({
            url: '/api/Stages/GetProjectType?command.projectTypeId=' + this.caseInfo.ProjectType.Id,
            method: 'GET'
        });
        let stage = JSON.parse(res.body).Result.Stages;
        stage.forEach(st => {
            if (st.Name === name) {
                find = true;
                stObj.Id = st.Id;
                stObj.Name = st.Name;
            }
        });
        if (!find) {
            this.Error['message'] = 'Стадия '+name+' не найдена';
        } else {
            this.caseInfo.Stage = stObj;
        }
    }

    //Получение Проекта дела
    getProject() {
        if (this.caseInfo.ProjectGroup) {
            return this.caseInfo.ProjectGroup.Name;
        } else {
            return null;
        }
    }
    //Смена Проекта
    setProject(nameProj, nameFold) {
        let find = false;
        let body = {
            "Page": 0,
            "PageSize": 500
        };
        let res = fetch({
            url: 'api/ProjectGroups/PostProjectGroups',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        let responseble = JSON.parse(res.body).Result;
        responseble.forEach(i => {
            if (i.Name === nameProj && i.ProjectFolder.Name === nameFold) {
                find = true;
                console.log(JSON.stringify(this.id));
                console.log(JSON.stringify(i.Id));
                let body = {
                        "ProjectId": this.id,
                        "ProjectGroupId": i.Id
                    };
                let res = fetch({
                    url: 'api/ProjectAction/MoveToProjectGroup',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                });
            }
        });
        if (!find) return null;
    }
    //Получение Папки дела
    getFolder() {
        if (this.caseInfo.ProjectFolder) {
            return this.caseInfo.ProjectFolder.Name;
        } else {
            return null;
        }
    }

    //Получение ответственного
    getResponsible() {
        if (this.caseInfo.Responsible) {
            return this.caseInfo.Responsible.Name;
        } else {
            return null;
        }
    }
    //Смена ответственного
    setResponsible(name) {
        let resObj = {};
        let body = {
                "UserType": "User",
                "NameString": name,
                "Page": 0,
                "PageSize": 0
            };
        let res = fetch({
            url: '/api/Users/GetUsers',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        let responseble = JSON.parse(res.body).Result[0];
        resObj.Id = responseble.Id;
        resObj.Name = responseble.Name;
        this.caseInfo.Responsible = resObj;
    }
    //Получение клиента по делу
    getClient() {
        if (this.caseInfo.Client) {
            return this.caseInfo.Client.Name;
        } else {
            return null;
        }
    }
    //Смена клиента по делу
    setClient(name) {
        let resObj = {};
        let body = {
            "Names": [name],
            "Page": 0,
            "PageSize": 20
        };
        let res = fetch({
            url: '/api/Participants/GetParticipants',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        let responseble = JSON.parse(res.body);
        let findResponsible = responseble.Result.find(r => r.DisplayName === name);
        resObj.Id = findResponsible.Id;
        resObj.Name = findResponsible.DisplayName;
        this.caseInfo.Client = resObj;
    }

    //Получение основных данных по делу
    getinfo() {
        let res = fetch({
            url: '/api/Projects/GetProject/' + this.id,
            method: 'GET'
        });
        let otvet = JSON.parse(res.body).Result;
        otvet.ProjectType.Tabs.forEach(tab => {
            if (tab.IsSystem === false) {
                this.tabs.push({Id: tab.Id, Name: tab.Name, blocks: []});
            }
        });
        return otvet;
    }
    //Получение блоков с основной вкладки
    getMainBlocks() {
        let res = fetch({
            url: '/api/ProjectCustomValues/GetProjectSummary?request.id=' + this.id,
            method: 'GET'
        });
        return JSON.parse(res.body).Result;
    }

    //Получение блоков из дополнительных вкладок
    getAllTabBlocks() {
        if (this.tabs.length !== 0) {
            this.tabs.forEach(tab => {
                let res = fetch({
                url: '/api/ProjectCustomValues/GetProjectTab?request.id=' + this.id + '&request.projectTypeTabId=' + tab.Id,
                method: 'GET'
                });
                let otvet = JSON.parse(res.body).Result;
                otvet.MetadataOfBlocks.forEach(el => {
                    tab.blocks.push(el.Id);
                });
                this.caseBlocks.Blocks = this.caseBlocks.Blocks.concat(otvet.Blocks);
                this.caseBlocks.MetadataOfBlocks = this.caseBlocks.MetadataOfBlocks.concat(otvet.MetadataOfBlocks);
                this.caseBlocks.Images = this.caseBlocks.Images.concat(otvet.Images);
                this.caseBlocks.FormulaDependencies = this.caseBlocks.FormulaDependencies.concat(otvet.FormulaDependencies);
            }); 
        } 
    }

    //Запись в дело
    save() {
        let casedata = JSON.parse(JSON.stringify(this.caseInfo));
        casedata.Blocks = this.caseBlocks.Blocks;
        let request = {
            url: '/api/Projects/UpdateProjectSummary',
            method: 'PUT',
            body: JSON.stringify(casedata),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let response = fetch(request);
            if (response.status !== 200) {
                this.Error.message = JSON.parse(response.body).Error;
                return false;
            }
        return true;
    }

    //Запись данных во вкладку в деле
    saveTab(tabname) {
        let tabid = '';
        let blocks = null;
        this.tabs.forEach(tab => {
            if (tab.Name === tabname) {
                tabid = tab.Id;
                blocks = tab.blocks;
            }
        });
        let tabBlocks = [];
        if (blocks) {
            blocks.forEach(a => {
                this.caseBlocks.Blocks.forEach(b => {
                    if (b.VisualBlockId === a) {
                        tabBlocks.push(b);
                    }
                });
            });
        }
        let requestUpdate = {};
        requestUpdate.Id = this.caseInfo.Id;
        requestUpdate.ProjectTypeTabId = tabid;
        requestUpdate.Blocks = tabBlocks;
        let request = {
            url: '/api/Projects/UpdateProjectTab',
            method: 'PUT',
            body: JSON.stringify(requestUpdate),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let response = fetch(request);
            if (response.status !== 200) {
                this.Error.message = JSON.parse(response.body).Error;
                return false;
            }
        return true;
    }

    //Получение id поля по "Тэгу", "Системному тегу" или "Имени поля"
    getid(textFind, typeFind = 'Tag') {
        let result = {};
        let ok = false;
        this.caseBlocks.MetadataOfBlocks.forEach((MBlock) => {
            MBlock.Lines.forEach((MLine) => {
                MLine.Fields.forEach((MField) => {
                    switch(typeFind) {
                    case 'Tag':
                        if (MField.Tag === textFind) {
                            result.idB = MBlock.Id;
                            result.idL = MLine.Id;
                            result.idF = MField.Id;
                            result.name = MField.ProjectField.Name;
                            result.type = MField.ProjectField.DataFormat.SysName;
                            ok = true;
                        }
                        break;
                    case 'Name':
                        if (MField.ProjectField.Name === textFind) {
                            result.idB = MBlock.Id;
                            result.idL = MLine.Id;
                            result.idF = MField.Id;
                            result.name = MField.ProjectField.Name;
                            result.type = MField.ProjectField.DataFormat.SysName;
                            ok = true;
                        }
                        break;
                    case 'ExternalTag':
                        if (MField.ExternalTag === textFind) {
                            result.idB = MBlock.Id;
                            result.idL = MLine.Id;
                            result.idF = MField.Id;
                            result.name = MField.ProjectField.Name;
                            result.type = MField.ProjectField.DataFormat.SysName;
                            ok = true;
                        }
                        break;
                    default:
                        throw "Недопустимый критерий поиска. Искать можно только по 'Tag', 'ExternalTag' и 'Name' поля";
                    }
                });
            });
        });
        if (!ok) throw "Поле с "+typeFind+" "+textFind+" не найдено";
        return result;
    }

    //Получение значения из поля по тегу
    getValue(textFind, typeFind = 'Tag', lineNumInBlock = false) {
        let result = [];
        let resultObj = {};
        let count = 0;
        let linecount = [];
        let findValueFlag = false;
        let findLineFlag = false;
        let meta = this.getid(textFind, typeFind);
        let findBlockFlag = false;
        this.caseBlocks.Blocks.forEach((Block) => {
            if (Block.VisualBlockId === meta.idB) {
                count = 0;
                findBlockFlag = true;
                findLineFlag = false;
                Block.Lines.forEach((Line) => {
                    if (Line.BlockLineId === meta.idL) {
                        count++;
                        findLineFlag = true;
                        findValueFlag = false;
                        Line.Values.forEach((Value) => {
                            if (Value.VisualBlockProjectFieldId === meta.idF) {
                                findValueFlag = true;
                                switch(meta.type) {
                                case "Text" :
                                case "Number":
                                case "Date":
                                case "Bool":
                                case "TextArea":
                                case "Hyperlink":
                                case "TemplateNumber":
                                case "RequiredBool":
                                    result.push(Value.Value);
                                    break;
                                case "CalculationFormula":
                                    result.push(Value.Value.Result);
                                    break;
                                case "Dictionary":
                                case "Participant":
                                case "User":
                                case "Case":
                                    result.push(Value.Value);
                                    break;
                                case "Document":
                                    let temp = {"Id": Value.Value.Id,
                                                "Name": Value.Value.Name
                                                };
                                    result.push(temp);
                                    break;
                                default:
                                    throw "С полем типа "+meta.type+" я пока работать не умею :(";
                                }
                            }  
                        });
                        if (!findValueFlag) result.push(null);
                    }
                });
                if (!findLineFlag) {
                    result.push(null);
                    linecount.push(1);
                } else {
                    linecount.push(count);
                }
            }
        });
        if(!findBlockFlag) {
            result.push(null);
            linecount.push(1);
        }
        resultObj.value = result;
        resultObj.struct = linecount;
        if (lineNumInBlock) return resultObj;
        else if (result.length === 1) return result[0];
        else return result;
    }

    //Запись значения в поле по тегу
    setValue(value, textFind, typeFind = 'Tag') {
        let valueint = {value: [], struct: []};
        let typeobject = {}.toString.call(value);
        if (typeobject === "[object Array]") {
            valueint.value = value;
            for(let a=0;a<value.length;a++) {
                valueint.struct[a] = 1;
            }
        } else if (typeobject === "[object Object]") {
            if (value.struct) {
                valueint = value;
            } else {
                valueint.value[0] = value;
                valueint.struct[0] = 1;
            } 
        } else {
            valueint.value[0] = value;
            valueint.struct[0] = 1;
        }

        let count = valueint.struct.length;
        let meta = this.getid(textFind, typeFind);
        let template = [];
        let n = 0;           
        for (let i = 0; i < count; i++) {
            template[i] = {};
            template[i].VisualBlockId = meta.idB;
            template[i].Lines = [];
            for (let j = 0; j<valueint.struct[i]; j++) {
                template[i].Lines[j] = {Values:[{}]};
                template[i].Lines[j].BlockLineId = meta.idL;
                template[i].Lines[j].Values[0].VisualBlockProjectFieldId = meta.idF;
                template[i].Lines[j].Values[0].Value = valueint.value[n];
                n++;
            }
        }

            let i = 0,j = 0;
            let isFindField = false;
            let isFindLine = false;
            let isFindBlock = false;
            this.caseBlocks.Blocks.forEach((db, nb) => {
                if (db.VisualBlockId === meta.idB) {
                    isFindBlock = true;
                    db.Lines.forEach((dl, nl) => {
                        if (dl.BlockLineId === meta.idL) {
                            isFindField = false;
                            isFindLine = true;
                            dl.Values.forEach((dv, nv) => {
                                if (dv.VisualBlockProjectFieldId === meta.idF) {
                                    dv.Value = template[i].Lines[j].Values[0].Value;
                                    isFindField = true;
                                }
                            });
                            if (!isFindField) {
                                dl.Values.push(template[i].Lines[j].Values[0]);
                            }
                            j++;
                        }
                    });
                    if (!isFindLine) {
                        db.Lines.push(template[i].Lines[j]);
                    }
                j = 0;
                i++;
                }
            });
            if (!isFindBlock) {
                template.forEach(t => {
                    this.caseBlocks.Blocks.push(t);
                });
            }
    }

/**Вставка мулти-строки в нужное место с заполнением одного значения в строке
     * @param value (Number, String, Array) - значение для записи или их массив
     * @param numBl (Number) - Порядковый номер блока с 1
     * @param numLn (Number) - Порядковый номер строки в которой хотим записать значение с 1
     * @param textFind (String) - Строка для поиска
     * @param typeFind = 'Tag' (String) Вариант поиска (Tag, ExternalTag, Name)
     * @result (Number) - Индекс первой вставленной строки
     */
    insertValue(value, numBl, numLn , textFind, typeFind = 'Tag') {
        let typeobject = {}.toString.call(value);
        if (typeobject != "[object Array]") {
            value = [value];
        } else if (typeobject === "[object Array]") {
            value = value.reverse();
        }
        let meta = this.getid(textFind, typeFind);
        console.log(JSON.stringify(meta));
        let templateSave = [];
        let template = {
            "BlockLineId": meta.idL,
            "Values": [{
                "Value": null,
                "VisualBlockProjectFieldId": meta.idF
            }]
        };

        let i = 1;
        let j = 1;
        let index = 0;
        let flagFindLine = false;
        let flagFindBlock = false;

        this.caseBlocks.Blocks.forEach((db, nb) => {
            if (db.VisualBlockId === meta.idB) {
                if (numBl === i) {
                    flagFindBlock = true;
                    db.Lines.forEach((dl, nl) => {
                        if (dl.BlockLineId === meta.idL) {
                            if (numLn === j) {
                                index += j-1;
                                flagFindLine = true;
                                templateSave = JSON.parse(JSON.stringify(dl.Values));
                                dl.Values.forEach(df => {
                                    if (df.VisualBlockProjectFieldId === meta.idF) {
                                        df.Value = value[0];
                                    } else {
                                        df.Value = null;
                                    }
                                });
                            } else if (j > numLn && numLn != 0) {
                                let temp = JSON.parse(JSON.stringify(templateSave));
                                templateSave = JSON.parse(JSON.stringify(dl.Values));
                                db.Lines[nl].Values = temp; 
                            }
                            j++;
                        } 
                    });
                    if (!flagFindLine) {
                        console.log('Not Find Line');
                        index += j-1;
                        template.Values[0].Value = value[0];
                        db.Lines.push(template);
                    } else {
                        template.Values = templateSave;
                        db.Lines.push(template);
                    }
                } else if (i < numBl) {
                    db.Lines.forEach((dl, nl) => {
                        if (dl.BlockLineId === meta.idL) {
                            index++;
                        }
                    });
                }
                i++;
            }
        });
        if (!flagFindBlock) {
            console.log('Not Find Block');
            let temp_block = {};
            temp_block.VisualBlockId = meta.idB;
            temp_block.Lines = [];
            temp_block.Lines.push(template);
            temp_block.Lines[0].Values[0].Value = value[0];
            this.caseBlocks.Blocks.push(temp_block);
        }

        console.log('Результирующий индекс: '+index);
        console.log('Количество мультистрок в текущем блоке: '+(j-1));
        return index;
    }

    /**
     * Вставка одной мульти-строки с записью множества значений 
     * @param value (Array) - Массив значений для записи
     * @param numBl (Number) - Порядковый номер блока с 1
     * @param numLn (Number) - Порядковый номер строки в которой хотим записать значение с 1
     * @param textFind (Array) - Массив тегов для поиска
     * @param typeFind = 'Tag' (String) Вариант поиска (Tag, ExternalTag, Name)
     * @result (Null)
     */
    insertLine(value, numBl, numLn , textFind, typeFind = 'Tag') {
        let ind = this.insertValue(value[0], numBl, numLn , textFind[0], typeFind);
        for(let i=1;i<value.length;i++) {
            let temp = this.getValue(textFind[i], typeFind, true);
            if (!temp) {temp = {value: [], struct: [1]}};
            temp.value[ind] = value[i];
            this.setValue(temp, textFind[i],typeFind);
        }
    }

    //==========EXPEREMENTAL===================
    addMultiLine(value, textFind, typeFind = 'Tag') {
        let count = value.length;
        let meta = this.getid(textFind, typeFind);
        let template = {};
        template.VisualBlockId = meta.idB;
        template.Lines = [];
        for (let j = 0; j<count; j++) {
            console.log(JSON.stringify('j='+j));
            template.Lines[j] = {Values:[{}]};
            template.Lines[j].BlockLineId = meta.idL;
            template.Lines[j].Values[0].VisualBlockProjectFieldId = meta.idF;
            template.Lines[j].Values[0].Value = value[j];
        }
        console.log(JSON.stringify(template));
        
            let j = 0;
            let isFindField = false;
            let isFindLine = false;
            let isFindBlock = false;
            this.caseBlocks.Blocks.forEach((db, nb) => {
                if (db.VisualBlockId === meta.idB) {
                    isFindBlock = true;
                    //console.log(JSON.stringify('Block '+nb));
                    db.Lines.forEach((dl, nl) => {
                        if (dl.BlockLineId === meta.idL) {
                            isFindLine = true;
                            //console.log(JSON.stringify('Line '+nl));
                            isFindField = false;
                            dl.Values.forEach((dv, nv) => {
                                if (dv.VisualBlockProjectFieldId === meta.idF) {
                                    console.log(JSON.stringify('VF j='+j));
                                    dv.Value = template.Lines[j].Values[0].Value;
                                    isFindField = true;
                                }
                            });
                            if (!isFindField) {
                                console.log(JSON.stringify('VnF j='+j));
                                dl.Values.push(template.Lines[j].Values[0]);
                            }
                            j++;
                        }
                    });
                    //if (!isFindLine) {
                    for (;j<count;j++) {
                        console.log(JSON.stringify('LnF j='+j));
                        db.Lines.push(template.Lines[j]);
                    }
                }
            });
            if (!isFindBlock) {
                    console.log(JSON.stringify('Block not find'));
                    this.caseBlocks.Blocks.push(template);
            }
    }

 /**
     * Создает cправочник вида {key: val}
     * где key - Tag, ExternalTag, Name, Id
     * а val - значение
     */
    parseBlock(key, name = 'All') {
        let result = {};
        let all = false;
        if (name === 'All') all = true;
        if (this.caseBlocks.Blocks) {
            this.caseBlocks.MetadataOfBlocks.forEach(b => {
                if (all || b.Name === name) {
                    b.Lines.forEach((l, ln) => {
                            l.Fields.forEach(f => {
                                let recKey = '';
                                if (key === 'Id') {
                                    recKey = f.Id;
                                } else if (key === 'Tag') {
                                    recKey = f.Tag;
                                } else if (key === 'ExternalTag') {
                                    recKey = f.ExternalTag;
                                } else if (key === 'Name') {
                                    recKey = f.ProjectField.Name;
                                } else {
                                    return null;
                                }
                                result[recKey] = (l.LineType.SysName === 'Repeated') ? [] : '';
                                //console.log(JSON.stringify(recKey));
                                this.caseBlocks.Blocks.forEach(bb => {
                                    bb.Lines.forEach(ll => {
                                        ll.Values.forEach(v => {
                                            if (l.LineType.SysName === 'Repeated') {
                                                if (v.VisualBlockProjectFieldId === f.Id) {
                                                    result[recKey][ll.Order] = v.Value;
                                                }
                                            } else {      
                                                if (v.VisualBlockProjectFieldId === f.Id) {                                         
                                                    result[recKey] = v.Value;
                                                }
                                            }
                                        });
                                    });
                                });
                            });
                    });
                }
            });
            return result;
        } else {
            return null;
        }
        
    }
    /**
     * Возвращает массив с объектами  из Id участников в деле с их ролями
     * @param (Null)
     * @result (Array) [{role: '', list: []}]
     */
    getParticipList() {
        let body = {
            "Types":[],
            "RoleIds":[],
            "ContextSearchString":"",
            "Page":1,
            "PageSize":100,
            "Projects":[this.id]
        };
        let respRolledPart = fetch({
            url: '/api/Participants/GetRolledParticipants',
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
                },
            body: JSON.stringify(body)
        });
        let allInfoRolledPart = JSON.parse(respRolledPart.body);
        let result = [];
        allInfoRolledPart.Result.forEach(p => {
            let nameRole = p.ProjectSummary.RoleInProject.Name;
            let findElem = result.find(name => name.role === nameRole);
            if (findElem) {
                findElem.list.push(p.Id);
            } else {
                result.push({role: nameRole, list: [p.Id]});
            }
        });
        return result;
    }
    /**
     * Возвращает массив с объектами  из Id участников в деле с их ролями
     * @param (Null)
     * @result (Array) [{role: '', list: []}]
     */
    getDocList() {
        let body = {
            "DocumentTypeIds":[],
            "StartReceivedDate":"",
            "EndReceivedDate":"",
            "AuthorIds":[],
            "FullSearchString":"",
            "DocumentSortOrder":{
                "Column":"Name",
                "IsAsc":true
            },
            "FolderId":this.caseInfo.DocumentFolderId,
            "ExternalStorage":null,
            "Page":1,
            "PageSize":100
        };
        let respDoc = fetch({
            url: '/api/VirtualCatalog/GetContent',
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
                },
            body: JSON.stringify(body)
        });
        let allInfoDoc = JSON.parse(respDoc.body);
        let result = [];
        allInfoDoc.Result.forEach(d => {
            let isImportedCB = (d.DocumentType.SysName === "ImpotedFromCB") ? true : false;
            let temp = {
                "Name": d.Name,
                "Extension": d.Extension,
                "DocumentType": d.DocumentType.Name,
                "isImportedCB": isImportedCB,
                "ReceivedDate": d.ReceivedDate,
                "File": d.File
            };
            result.push(temp);
        });
        return result;
    }
}