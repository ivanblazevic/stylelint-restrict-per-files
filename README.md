#Restrict usage of color variables in SASS/SCSS only to certain files

In the example bellow, color variables can only be defined in `styles\common\variables.scss`.

```
"restrict/color-variables-per-files": {
  files: ["styles\\common\\variables.scss"]
},
```

IMPORTANT: This path needs to be adjusted based on OS.
