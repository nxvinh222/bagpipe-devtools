export function getSingleElement(selected_element) {
    let outer;
    let father;

    let final_child;
    let final_father;
    let final;

    let outer_nodename;
    let father_nodename;

    let child_classname = "";
    let outer_classname = "";
    let father_classname = "";

    outer = selected_element;
    if (selected_element.className != "") {
        child_classname = '.' + selected_element.className.split(' ').join('.');
    } else {
        while (outer.className == "") {
            if (outer.parentElement == null) break;
            outer = outer.parentElement;
        }
        outer_classname = '.' + outer.className.split(' ').join('.');
    }

    if (outer_classname == "")
        outer_nodename = ""
    else
        outer_nodename = outer.nodeName;
    final_child = outer_nodename + outer_classname + " " + selected_element.nodeName + child_classname;

    // get father
    father = outer;
    do {
        if (father.parentElement == null) break;
        father = father.parentElement;
    } while (father.className == "");
    father_classname = '.' + father.className.split(' ').join('.');

    final_father = father.nodeName + father_classname + " ";

    final = final_father + final_child;

    return final;
}
