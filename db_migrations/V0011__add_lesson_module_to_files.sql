-- Add lesson_id and module_id columns to course_files for better organization
ALTER TABLE course_files 
ADD COLUMN IF NOT EXISTS lesson_id INTEGER,
ADD COLUMN IF NOT EXISTS module_id INTEGER;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_course_files_lesson_id ON course_files(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_files_module_id ON course_files(module_id);