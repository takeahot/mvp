function log(val) {
  console.log(JSON.stringify(val));
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16).toLowerCase();
  });
}

function setDataOnExternalID() {
  let data = getJsonData();
  let result = new Object();

  result.requestData = data;

  if (!data.Id) {
    result.status = 500;
    result.message = "Case id is required";
    setJsonResult(result);
  } else {
    let projectId = data.Id;
    let dataBlock = [];
    let mappingData = data.Fields;
    let idsBlocksArr = {};
    let blocksData = {
      block: {},
      line: {},
      field: {},
    };
    let responseCase = fetch({
      url: "/api/projects/GetProject/" + projectId,
      method: "GET",
    });
    let responseBlocks = fetch({
      url: "/api/ProjectCustomValues/GetAllVisualBlocks?ProjectId=" + projectId,
      method: "GET",
    });
    let responseCaseData = JSON.parse(responseCase.body);
    let responseBlocksData = JSON.parse(responseBlocks.body);
    let mappingDataValues = {};
    let mappingDataValuesMulti = {};
    let multiline = mappingData.multiline ? mappingData.multiline : [];
    let multiblock = mappingData.multiblock ? mappingData.multiblock : [];

    responseBlocksData.Result.Blocks.forEach((visualBlock, blockIndex) => {
      blocksData.block[visualBlock.VisualBlockId] =
        responseBlocksData.Result.Blocks[blockIndex];

      responseBlocksData.Result.Blocks[blockIndex].Lines.forEach(
        (line, lineIndex) => {
          blocksData.line[line.BlockLineId] =
            responseBlocksData.Result.Blocks[blockIndex].Lines[lineIndex];
          responseBlocksData.Result.Blocks[blockIndex].Lines[
            lineIndex
          ].Values.forEach((field, fieldIndex) => {
            blocksData.field[field.VisualBlockProjectFieldId] =
              responseBlocksData.Result.Blocks[blockIndex].Lines[
                lineIndex
              ].Values[fieldIndex];
          });
        }
      );
    });

    responseBlocksData.Result.MetadataOfBlocks.forEach((visualBlock) => {
      visualBlock.Lines.forEach((line) => {
        line.Fields.forEach((field) => {
          // change this to 
          // to use [field.ExternalTag] instead of  [field.Tag] or vice versa
          // required chnages will be marked with this comment - "<--------- replace (Tag/ExternalTag)"
          mappingDataValues[field.ExternalTag] = blocksData.field[field.Id];
        });
      });
    });

    setJsonResult(responseBlocksData.Result.Blocks);

    responseBlocksData.Result.MetadataOfBlocks.forEach((visualBlock) => {
      let $block = {
        FrontOrder: 0,
        Lines: [],
        Name: visualBlock.NameInProject,
        Order: 0,
        TempId: null,
        VisualBlockId: visualBlock.Id,
      };

      if (visualBlock.IsRepeatable) {
        if (multiblock.length) {
          multiblock.forEach((blockItem) => {
            let $multiblock = {
              Id: uuidv4(),
              Lines: [],
              Name: visualBlock.NameInProject,
              Order: 0,
              TempId: null,
              VisualBlockId: visualBlock.Id,
            };

            visualBlock.Lines.forEach((line) => {
              let $line = {
                Id: uuidv4(),
                BlockLineId: line.Id,
                Values: [],
              };

              line.Fields.forEach((field, fld) => {
                if (blockItem[field.Tag]) {
                  // <--------- replace (Tag/ExternalTag)
                  let $value = blockItem[field.Tag]; // <--------- replace (Tag/ExternalTag)

                  switch (field.ProjectField.ProjectFieldFormat.SysName) {
                    case "Number":
                      $value = parseInt($value);
                      break;

                    case "Dictionary":
                      let url =
                        "/" +
                        field.ProjectField.ProjectFieldFormat.Dictionary.ApiUrl;
                      let body = {
                        Ids: [$value],
                      };
                      let resDictionary = fetch({
                        url: url,
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });

                      resDictionaryData = JSON.parse(resDictionary.body);

                      $value = resDictionaryData.Result[0];

                      break;

                    case "User":
                      let bodyUser = {
                        Name: $value,
                      };
                      let resUser = fetch({
                        url: "/api/CompanyUsersSuggest/GetUsers",
                        method: "POST",
                        body: JSON.stringify(bodyUser),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });

                      let resUserData = JSON.parse(resUser.body);

                      $value = resUserData.Result[0];

                      break;

                    case "Participant":
                      let resPart = fetch({
                        url:
                          "/api/Participants/GetParticipant?participantId=" +
                          $value,
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });

                      let resPartData = JSON.parse(resPart.body);

                      if (resPartData.Result) {
                        $value = {
                          Id: resPartData.Result.Id,
                          Name: resPartData.Result.DisplayName,
                        };
                      }

                      break;

                    case "Case":
                      let resCase = fetch({
                        url: "/api/projects/GetProject?projectId=" + $value,
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });

                      let resCaseData = JSON.parse(resCase.body);

                      if (resCaseData.Result) {
                        $value = {
                          Id: resCaseData.Result.Id,
                          Name: resCaseData.Result.Name,
                        };
                      }

                      break;
                  }

                  $line.Values.push({
                    VisualBlockProjectFieldId: field.Id,
                    Value: $value,
                  });
                }

                if (fld == line.Fields.length - 1 && $line.Values.length) {
                  $multiblock.Lines.push($line);

                  blocksData.line[line.Id] = $line;
                  blocksData.block[visualBlock.Id] = $multiblock;
                  responseBlocksData.Result.Blocks.push($multiblock);
                }
              });
            });
          });
        }
      } else {
        visualBlock.Lines.forEach((line) => {
          let $line = {
            Id: uuidv4(),
            BlockLineId: line.Id,
            Values: [],
          };

          if (line.LineType && line.LineType.SysName === "Repeated") {
            if (multiline.length) {
              multiline.forEach((lineItem, ml) => {
                let $multiline = {
                  Id: uuidv4(),
                  BlockLineId: line.Id,
                  Values: [],
                };

                line.Fields.forEach((field, fld) => {
                  if (lineItem[field.Tag]) {
                    // <--------- replace (Tag/ExternalTag)
                    let $value = lineItem[field.Tag]; // <--------- replace (Tag/ExternalTag)

                    switch (field.ProjectField.ProjectFieldFormat.SysName) {
                      case "Number":
                        $value = parseInt($value);
                        break;

                      case "Dictionary":
                        let url =
                          "/" +
                          field.ProjectField.ProjectFieldFormat.Dictionary
                            .ApiUrl;
                        let body = {
                          Ids: [$value],
                        };
                        let resDictionary = fetch({
                          url: url,
                          method: "POST",
                          body: JSON.stringify(body),
                          headers: {
                            "Content-Type": "application/json",
                          },
                        });

                        resDictionaryData = JSON.parse(resDictionary.body);
                        $value = resDictionaryData.Result[0];
                        break;

                      case "User":
                        let bodyUser = {
                          Name: $value,
                        };
                        let resUser = fetch({
                          url: "/api/CompanyUsersSuggest/GetUsers",
                          method: "POST",
                          body: JSON.stringify(bodyUser),
                          headers: {
                            "Content-Type": "application/json",
                          },
                        });
                        let resUserData = JSON.parse(resUser.body);

                        $value = resUserData.Result[0];
                        break;

                      case "Participant":
                        let resPart = fetch({
                          url:
                            "/api/Participants/GetParticipant?participantId=" +
                            $value,
                          method: "GET",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        });

                        let resPartData = JSON.parse(resPart.body);

                        if (resPartData.Result) {
                          $value = {
                            Id: resPartData.Result.Id,
                            Name: resPartData.Result.DisplayName,
                          };
                        }

                        break;

                      case "Case":
                        let resCase = fetch({
                          url: "/api/projects/GetProject?projectId=" + $value,
                          method: "GET",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        });

                        let resCaseData = JSON.parse(resCase.body);

                        if (resCaseData.Result) {
                          $value = {
                            Id: resCaseData.Result.Id,
                            Name: resCaseData.Result.Name,
                          };
                        }

                        break;
                    }

                    $multiline.Values.push({
                      VisualBlockProjectFieldId: field.Id,
                      Value: $value,
                    });
                  }

                  if (
                    fld == line.Fields.length - 1 &&
                    $multiline.Values.length
                  ) {
                    blocksData.line[line.Id] = $multiline;
                    if (blocksData.block[visualBlock.Id]) {
                      blocksData.block[visualBlock.Id].Lines.push($multiline);
                    } else {
                      blocksData.block[visualBlock.Id] = $block;
                      blocksData.block[visualBlock.Id].Lines.push($multiline);
                      responseBlocksData.Result.Blocks.push($block);
                    }
                  }
                });
              });
            }
          } else {
            line.Fields.forEach((field) => {
              if (mappingData[field.Tag]) {
                // <--------- replace (Tag/ExternalTag)
                let $value = mappingData[field.Tag]; // <--------- replace (Tag/ExternalTag)

                switch (field.ProjectField.ProjectFieldFormat.SysName) {
                  case "Number":
                    $value = parseInt($value);
                    break;

                  case "Dictionary":
                    let url =
                      "/" +
                      field.ProjectField.ProjectFieldFormat.Dictionary.ApiUrl;
                    let body = {
                      Ids: [$value],
                    };
                    let resDictionary = fetch({
                      url: url,
                      method: "POST",
                      body: JSON.stringify(body),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });

                    resDictionaryData = JSON.parse(resDictionary.body);

                    $value = resDictionaryData.Result[0];

                    break;
                  case "User":
                    let bodyUser = {
                      Name: $value,
                    };
                    let resUser = fetch({
                      url: "/api/CompanyUsersSuggest/GetUsers",
                      method: "POST",
                      body: JSON.stringify(bodyUser),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });

                    let resUserData = JSON.parse(resUser.body);

                    $value = resUserData.Result[0];

                    break;

                  case "Participant":
                    let resPart = fetch({
                      url:
                        "/api/Participants/GetParticipant?participantId=" +
                        $value,
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });

                    let resPartData = JSON.parse(resPart.body);

                    if (resPartData.Result) {
                      $value = {
                        Id: resPartData.Result.Id,
                        Name: resPartData.Result.DisplayName,
                      };
                    }

                    break;

                  case "Case":
                    let resCase = fetch({
                      url: "/api/projects/GetProject?projectId=" + $value,
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });

                    let resCaseData = JSON.parse(resCase.body);

                    if (resCaseData.Result) {
                      $value = {
                        Id: resCaseData.Result.Id,
                        Name: resCaseData.Result.Name,
                      };
                    }

                    break;
                }

                if (blocksData.field[field.Id]) {
                  blocksData.field[field.Id].VisualBlockProjectFieldId =
                    field.Id;
                  blocksData.field[field.Id].Value = $value;
                } else if (
                  blocksData.line[line.Id] &&
                  line.LineType.SysName != "Repeated"
                ) {
                  blocksData.line[line.Id].Values.push({
                    VisualBlockProjectFieldId: field.Id,
                    Value: $value,
                  });

                  blocksData.line[line.Id] = $line;
                } else if (blocksData.block[visualBlock.Id]) {
                  $line.Values.push({
                    VisualBlockProjectFieldId: field.Id,
                    Value: $value,
                  });

                  blocksData.line[line.Id] = $line;
                  blocksData.block[visualBlock.Id].Lines.push($line);
                } else {
                  $line.Values.push({
                    VisualBlockProjectFieldId: field.Id,
                    Value: $value,
                  });
                  $block.Lines.push($line);

                  blocksData.line[line.Id] = $line;
                  blocksData.block[visualBlock.Id] = $block;
                  responseBlocksData.Result.Blocks.push($block);
                }
              }
            });
          }
        });
      }
    });

    responseCaseData.Result.Blocks = responseBlocksData.Result.Blocks;

    // log(responseCaseData.Result);

    var response = fetch({
      url: "/api/Projects/UpdateProjectWithBlocks",
      method: "PUT",
      body: JSON.stringify(responseCaseData.Result),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  setJsonResult(response);
}

setDataOnExternalID();

export { setDataOnExternalID };