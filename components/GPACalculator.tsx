
import React, { useState } from 'react';
import { Button } from './Button';
import { Trash2, Plus, BookOpen, GraduationCap } from 'lucide-react';
import { SEO } from './SEO';

interface Course {
    id: number;
    name: string;
    credits: number;
    grade: string;
}

interface Semester {
    id: number;
    name: string;
    courses: Course[];
}

const gradeScales: any = {
    '4.0': { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 },
    '5.0': { 'A': 5.0, 'A-': 4.7, 'B+': 4.3, 'B': 4.0, 'B-': 3.7, 'C+': 3.3, 'C': 3.0, 'C-': 2.7, 'D+': 2.3, 'D': 2.0, 'F': 0.0 }
};

export const GPACalculator: React.FC = () => {
    const [scale, setScale] = useState('4.0');
    const [semesters, setSemesters] = useState<Semester[]>([
        { 
            id: 1, 
            name: 'Semester 1', 
            courses: [
                { id: 1, name: 'Course 1', credits: 3, grade: 'A' },
                { id: 2, name: 'Course 2', credits: 3, grade: 'B' },
                { id: 3, name: 'Course 3', credits: 3, grade: 'A-' },
            ] 
        }
    ]);

    // Helpers
    const points = gradeScales[scale];
    
    const addSemester = () => {
        setSemesters([...semesters, {
            id: Date.now(),
            name: `Semester ${semesters.length + 1}`,
            courses: [{ id: Date.now(), name: 'Course 1', credits: 3, grade: 'A' }]
        }]);
    };

    const addCourse = (semId: number) => {
        setSemesters(semesters.map(s => {
            if (s.id !== semId) return s;
            return {
                ...s,
                courses: [...s.courses, { id: Date.now(), name: `Course ${s.courses.length + 1}`, credits: 3, grade: 'A' }]
            };
        }));
    };

    const removeCourse = (semId: number, courseId: number) => {
        setSemesters(semesters.map(s => {
            if (s.id !== semId) return s;
            return { ...s, courses: s.courses.filter(c => c.id !== courseId) };
        }));
    };

    const updateCourse = (semId: number, courseId: number, field: keyof Course, val: any) => {
        setSemesters(semesters.map(s => {
            if (s.id !== semId) return s;
            // Enforce positive credits
            const value = field === 'credits' ? Math.max(0, Number(val)) : val;
            return {
                ...s,
                courses: s.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
            };
        }));
    };

    const removeSemester = (id: number) => {
        setSemesters(semesters.filter(s => s.id !== id));
    };

    // Calculate
    let totalPoints = 0;
    let totalCredits = 0;

    const semesterGPAs = semesters.map(s => {
        let semPoints = 0;
        let semCredits = 0;
        s.courses.forEach(c => {
            const p = points[c.grade] || 0;
            semPoints += p * c.credits;
            semCredits += c.credits;
        });
        
        totalPoints += semPoints;
        totalCredits += semCredits;

        return semCredits ? (semPoints / semCredits).toFixed(2) : '0.00';
    });

    const cumulativeGPA = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <SEO 
                title="GPA Calculator - Cumulative & Semester"
                description="Calculate your semester and cumulative GPA easily. Supports 4.0 and 5.0 grading scales. Add multiple semesters and courses."
                keywords="gpa calculator, grade point average, college gpa, high school gpa, 4.0 scale calculator"
            />
            <header className="text-center mb-6 pt-4">
                <h1 className="text-2xl font-bold text-slate-900">GPA <span className="text-brand-600">Calculator</span></h1>
                <p className="text-sm text-slate-500 mt-1">Calculate semester and cumulative GPA.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {semesters.map((sem, idx) => (
                        <div key={sem.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={16} className="text-brand-600"/>
                                    <input 
                                        value={sem.name}
                                        onChange={(e) => {
                                            const newSem = [...semesters];
                                            newSem[idx].name = e.target.value;
                                            setSemesters(newSem);
                                        }}
                                        className="bg-transparent font-bold text-black focus:outline-none focus:border-b border-brand-500 w-32 md:w-auto"
                                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-bold text-slate-600">GPA: <span className="text-brand-600">{semesterGPAs[idx]}</span></div>
                                    <button onClick={() => removeSemester(sem.id)} className="text-slate-400 hover:text-red-500 transition">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-4 space-y-3">
                                {/* Header: Visible only on tablet+ */}
                                <div className="hidden sm:grid grid-cols-[2fr,1fr,1fr,auto] gap-2 text-xs font-bold text-slate-400 uppercase px-2">
                                    <div>Course Name</div>
                                    <div>Grade</div>
                                    <div>Credits</div>
                                    <div></div>
                                </div>
                                
                                {sem.courses.map(c => (
                                    <div key={c.id} className="flex flex-col sm:grid sm:grid-cols-[2fr,1fr,1fr,auto] gap-2 p-2 bg-slate-50/50 rounded-lg sm:bg-transparent">
                                        <input 
                                            value={c.name}
                                            onChange={e => updateCourse(sem.id, c.id, 'name', e.target.value)}
                                            className="p-2 border border-slate-300 rounded-lg text-sm font-medium text-black bg-white w-full"
                                            placeholder="Course Name"
                                            style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                        />
                                        <div className="flex gap-2">
                                            <select 
                                                value={c.grade}
                                                onChange={e => updateCourse(sem.id, c.id, 'grade', e.target.value)}
                                                className="p-2 border border-slate-300 rounded-lg text-sm font-bold text-black bg-white cursor-pointer flex-1"
                                                style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                            >
                                                {Object.keys(points).map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                            <input 
                                                type="number"
                                                value={c.credits}
                                                onChange={e => updateCourse(sem.id, c.id, 'credits', e.target.value)}
                                                className="p-2 border border-slate-300 rounded-lg text-sm font-bold text-black bg-white flex-1"
                                                placeholder="Cr"
                                                style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                            />
                                            <button onClick={() => removeCourse(sem.id, c.id)} className="p-2 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-lg">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={() => addCourse(sem.id)} variant="ghost" size="sm" className="w-full mt-2 border-dashed border border-slate-300">
                                    <Plus size={14} className="mr-1"/> Add Course
                                </Button>
                            </div>
                        </div>
                    ))}
                    
                    <Button onClick={addSemester} className="w-full py-4 bg-slate-800 hover:bg-slate-900">
                        <Plus size={18} className="mr-2"/> Add Another Semester
                    </Button>
                </div>

                {/* Sidebar Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl sticky top-24">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Cumulative GPA</div>
                                <div className="text-6xl font-extrabold tracking-tighter text-white">{cumulativeGPA}</div>
                            </div>
                            <GraduationCap size={48} className="text-brand-500 opacity-20"/>
                        </div>

                        <div className="space-y-4 border-t border-slate-800 pt-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total Credits</span>
                                <span className="font-bold">{totalCredits}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Grade Points</span>
                                <span className="font-bold">{totalPoints.toFixed(1)}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Grading Scale</label>
                            <div className="flex bg-slate-800 p-1 rounded-lg">
                                <button onClick={() => setScale('4.0')} className={`flex-1 py-1.5 rounded text-sm font-bold transition ${scale === '4.0' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}>4.0</button>
                                <button onClick={() => setScale('5.0')} className={`flex-1 py-1.5 rounded text-sm font-bold transition ${scale === '5.0' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}>5.0</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
