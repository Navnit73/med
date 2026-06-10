import re

files_to_fix = [
    ("src/components/Navbar.jsx", "React"),
    ("src/context/AuthContext.jsx", "React, useEffect"),
    ("src/layouts/AdminLayout.jsx", "FileText, Users"),
    ("src/pages/FindDoctors.jsx", "React"),
    ("src/pages/Home.jsx", "React, UserCircle"),
    ("src/pages/Hospitals.jsx", "React, Users, ChevronRight"),
    ("src/pages/PublicDoctorProfile.jsx", "React, MapPin, Star, SpecIcon"),
    ("src/pages/SignIn.jsx", "React"),
    ("src/pages/admin/Dashboard.jsx", "ChevronRight"),
    ("src/pages/admin/hospitals/HospitalEdit.jsx", "React"),
    ("src/pages/admin/hospitals/HospitalList.jsx", "React"),
    ("src/pages/admin/hospitals/view/ContractsTab.jsx", "React"),
    ("src/pages/admin/hospitals/view/DashboardTab.jsx", "React"),
    ("src/pages/admin/hospitals/view/DepartmentForm.jsx", "React"),
    ("src/pages/admin/hospitals/view/DepartmentsTab.jsx", "React"),
    ("src/pages/admin/hospitals/view/DoctorForm.jsx", "React"),
    ("src/pages/admin/hospitals/view/DoctorProfile.jsx", "React, MapPin"),
    ("src/pages/admin/hospitals/view/DoctorsTab.jsx", "React"),
    ("src/pages/admin/hospitals/view/PatientsTab.jsx", "React"),
    ("src/pages/patient/Dashboard.jsx", "React, ArrowRight, Bell, Menu, menuOpen, setMenuOpen, initials"),
    ("src/pages/patient/Registration.jsx", "React"),
]

for file_path, vars in files_to_fix:
    with open(file_path, "r") as f:
        content = f.read()
    
    var_list = [v.strip() for v in vars.split(",")]
    
    # Simple regexes to remove variables from import blocks and assignments
    for v in var_list:
        if v == "React":
            content = re.sub(r'import React\s*,\s*\{\s*', 'import { ', content)
            content = re.sub(r'import React\s*,\s*', 'import ', content)
            content = re.sub(r'import React\s+from\s+[\'"]react[\'"];?\n?', '', content)
        elif v == "SpecIcon":
            content = re.sub(r'const\s+SpecIcon\s*=[^\n]+\n', '', content)
        elif v in ["menuOpen", "setMenuOpen"]:
            content = re.sub(r'const\s*\[\s*menuOpen\s*,\s*setMenuOpen\s*\]\s*=\s*useState[^;]+;\n?', '', content)
        elif v == "initials":
            content = re.sub(r'const\s+initials\s*=[^\n]+\n', '', content)
        else:
            # Remove from named imports: `import { X, Y, Z } ...`
            # We can use regex to remove `v, ` or `, v` or `v` from `{...}`
            content = re.sub(r'(\{\s*[^}]*?)\b' + v + r'\b\s*,\s*', r'\1', content)
            content = re.sub(r',\s*\b' + v + r'\b(\s*\})', r'\1', content)
            content = re.sub(r'\{\s*\b' + v + r'\b\s*\}', '{}', content)
            
            # Clean up empty import { } from ...
            content = re.sub(r'import\s*\{\s*\}\s*from\s*[\'"][^\'"]+[\'"];?\n?', '', content)
            
    with open(file_path, "w") as f:
        f.write(content)

