# Design: Role-Based Nav Conditions

## Visibility Per Role

```
     Courses    Dashboard    Teacher    Admin
Student   ✅          ✅          ❌        ❌
Teacher   ❌          ❌          ✅        ❌
Admin     ✅          ✅          ✅        ✅
```

## Conditions (each link independent)

| Link | Condition |
|------|-----------|
| Courses | `!userRole?.includes("teacher")` |
| Dashboard | `!userRole?.includes("teacher")` |
| Teacher | `userRole?.includes("teacher") \|\| userRole?.includes("admin")` |
| Admin | `userRole?.includes("admin")` |

## Blocks Updated

- Desktop nav (lines 125-168)
- User dropdown (lines 186-207)
- Mobile drawer (lines 274-307)
