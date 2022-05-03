export function getSimilarElement(selected_element) {
    if (selected_element.length < 2) return;

    // first element's father node
    let first_father = selected_element[0];
    // second element's father node
    let second_father = selected_element[1];

    // nearest outer that have classname
    let first_outer;
    let second_outer;

    // first element's class list
    let first_classlist;
    // second element's class list
    let second_classlist;
    // list of similar class betweeb first and second element
    let final_classlist = [];
    // flag to mark if there is no similar class
    // check outer class
    let no_class_flag = false;

    let attr_data_list = [];
    let final_attr = "";

    // father final selector
    let final_father;
    // child final selector
    let final_child;
    // combine of father and child selector
    let final_selector;

    // direct father nodename
    let direct_father_nodename

    // get closest father of 2 element
    while (true) {
        first_father = first_father.parentElement;
        second_father = second_father.parentElement;
        if (first_father.isSameNode(second_father)) break;
        if (first_father == undefined || second_father == undefined) {
            console.log("Can't find father element");
            break;
        }
    }

    // calculate closest father classname
    final_father = first_father.nodeName;
    if (first_father.className.length != 0)
        final_father += "." + first_father.className.split(" ").join(".");
    console.log("FINAL e father selector: ", final_father);

    // calculate similar class list between 2 element
    first_classlist = selected_element[0].className.split(" ");
    second_classlist = selected_element[1].className.split(" ");
    for (var i = 0; i < first_classlist.length; i++) {
        if (first_classlist[i] == second_classlist[i]);
        final_classlist.push(first_classlist[i]);
    }
    // if final classlist blank, check for outer element
    first_outer = selected_element[0].parentElement
    second_outer = selected_element[1].parentElement
    while (final_classlist[0].length == 0) {
        no_class_flag = true;
        final_classlist.pop();
        first_classlist = first_outer.className.split(" ");
        second_classlist = second_outer.className.split(" ");
        for (var i = 0; i < first_classlist.length; i++) {
            if (first_classlist[i] == second_classlist[i]);
            final_classlist.push(first_classlist[i]);
        }
        if (first_outer.parentElement == undefined || second_outer.parentElement == undefined) break;
        first_outer = first_outer.parentElement
        second_outer = second_outer.parentElement
    }

    // calculate attributes
    attr_data_list = Array.from(selected_element[0].attributes).filter((attribute) => {
        return attribute.nodeName.startsWith("data")
    })
    console.log("attr list with data: ", attr_data_list);
    for (let i = 0, n = attr_data_list.length; i < n; i++) {
        let first_value = selected_element[0].getAttribute(attr_data_list[i].nodeName);
        let second_value = selected_element[1].getAttribute(attr_data_list[i].nodeName);
        if (first_value == second_value) {
            final_attr = "[" + attr_data_list[i].nodeName + "=" + "'" + first_value + "'" + "]";
            console.log(final_attr);
            break;
        }
    }

    // If selected element dont have similar classname
    // final child = Parent nodename + Parent class + Element nodename + Element Attr
    if (no_class_flag) {
        // outer nodename and classname
        if (final_classlist[0].length != 0)
            final_child = first_outer.nodeName + "." + final_classlist.join(".");
        else
            final_child = first_outer.nodeName;

        final_child += " " + selected_element[0].nodeName + final_attr;
    }
    // else
    // final child = Element nodename + Element class
    else {
        if (final_classlist[0].length != 0)
            final_child = selected_element[0].nodeName + "." + final_classlist.join(".");
        else
            final_child = selected_element[0].nodeName
    }

    // add direct father nodename
    direct_father_nodename = "";
    // direct_father_nodename = first_outer.nodeName
    // if (final_child.startsWith(direct_father_nodename)) {
    //     direct_father_nodename = "";
    // } else {
    //     direct_father_nodename = " " + direct_father_nodename;
    // }

    // Combine Father and Child(Element)
    final_selector = final_father + direct_father_nodename + " " + final_child;

    console.log("final child: ", final_child);
    console.log("FINAL e selector: ", final_selector);
    return final_selector
}