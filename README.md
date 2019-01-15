# YAODRPB
Yet An Other Dicord Role Play Bot


---

To test on message editing

```javascript
const regex = /(\d{1,3}d\d{1,3})(\+\d{1,3}(d\d{1,3})*)*/gm;
const str = `ceci un un message normal

Test : 1d20

Perception : 4d6+4
Critique : 1d10+9

Et dégât suivant : 5d10+6d4+3`;
let m;

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
}

```

---
