import { Router, Request, Response } from 'express';
import { authenticate, validateSkill } from '../middleware';
import { SkillModel, TagModel } from '../models';

const router = Router();
const skillModel = new SkillModel();
const tagModel = new TagModel();

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all public skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of all public skills
 *       500:
 *         description: Server error
 */
router.get('/', (_req: Request, res: Response): void => {
  try {
    const skills = skillModel.findAll(true);
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   get:
 *     summary: Get skill by ID with owner and tags
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill details
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Server error
 */
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const skill = skillModel.findByIdWithOwner(parseInt(req.params.id));
    if (!skill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               is_public:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, validateSkill, (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { content, tags, is_public } = req.body;

    // Parse skill content to extract metadata (this is a simplified version)
    // In a real implementation, you'd parse frontmatter from the content
    const parsedData = parseSkillContent(content);

    const skill = skillModel.create({
      user_id: req.user.userId,
      filename: parsedData.filename,
      file_size: Buffer.byteLength(content, 'utf8'),
      name: parsedData.name,
      description: parsedData.description,
      version: parsedData.version,
      author: parsedData.author,
      content,
      is_public: is_public || false,
    });

    // Add tags if provided
    if (tags && Array.isArray(tags)) {
      tags.forEach((tagName: string) => {
        const tag = tagModel.findOrCreate(tagName.trim());
        skillModel.addTag(skill.id, tag.id);
        tagModel.incrementUsageCount(tag.id);
      });
    }

    const skillWithDetails = skillModel.findByIdWithOwner(skill.id);
    res.status(201).json(skillWithDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update a skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               is_public:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, (req: Request, res: Response): void => {
  try {
    const skillId = parseInt(req.params.id);
    const existingSkill = skillModel.findById(skillId);

    if (!existingSkill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    if (!req.user || existingSkill.user_id !== req.user.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { content, tags, is_public } = req.body;

    // Update skill
    const updateData: any = {};
    if (content !== undefined) updateData.content = content;
    if (is_public !== undefined) updateData.is_public = is_public;

    skillModel.update(skillId, updateData);

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Get current tags and decrement their usage count
      const currentTags = skillModel.getSkillTags(skillId);
      currentTags.forEach((tag) => tagModel.decrementUsageCount(tag.id));

      // Clear existing tags
      skillModel.clearTags(skillId);

      // Add new tags
      tags.forEach((tagName: string) => {
        const tag = tagModel.findOrCreate(tagName.trim());
        skillModel.addTag(skillId, tag.id);
        tagModel.incrementUsageCount(tag.id);
      });
    }

    const updatedSkill = skillModel.findByIdWithOwner(skillId);
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete a skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Skill deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, (req: Request, res: Response): void => {
  try {
    const skillId = parseInt(req.params.id);
    const skill = skillModel.findById(skillId);

    if (!skill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    if (!req.user || skill.user_id !== req.user.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Decrement tag usage counts
    const tags = skillModel.getSkillTags(skillId);
    tags.forEach((tag) => tagModel.decrementUsageCount(tag.id));

    const deleted = skillModel.delete(skillId);

    if (!deleted) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

/**
 * @swagger
 * /api/skills/{id}/download:
 *   post:
 *     summary: Increment download count
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Download count incremented
 *       404:
 *         description: Skill not found
 */
router.post('/:id/download', (req: Request, res: Response): void => {
  try {
    const skillId = parseInt(req.params.id);
    const skill = skillModel.findById(skillId);

    if (!skill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    skillModel.incrementDownloadCount(skillId);
    res.json({ message: 'Download count incremented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment download count' });
  }
});

/**
 * @swagger
 * /api/skills/{id}/clone:
 *   post:
 *     summary: Increment clone count
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Clone count incremented
 *       404:
 *         description: Skill not found
 */
router.post('/:id/clone', (req: Request, res: Response): void => {
  try {
    const skillId = parseInt(req.params.id);
    const skill = skillModel.findById(skillId);

    if (!skill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    skillModel.incrementCloneCount(skillId);
    res.json({ message: 'Clone count incremented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment clone count' });
  }
});

// Helper function to parse skill content
function parseSkillContent(content: string): {
  filename: string;
  name: string;
  description?: string;
  version: string;
  author?: string;
} {
  // This is a simplified parser. In production, you'd use a proper frontmatter parser
  const lines = content.split('\n');
  let name = 'Untitled Skill';
  let description: string | undefined;
  let version = '1.0.0';
  let author: string | undefined;

  // Look for frontmatter or metadata in comments
  for (const line of lines.slice(0, 20)) {
    if (line.includes('@name')) {
      name = line.split('@name')[1].trim();
    } else if (line.includes('@description')) {
      description = line.split('@description')[1].trim();
    } else if (line.includes('@version')) {
      version = line.split('@version')[1].trim();
    } else if (line.includes('@author')) {
      author = line.split('@author')[1].trim();
    }
  }

  const filename = name.toLowerCase().replace(/\s+/g, '-') + '.ts';

  return { filename, name, description, version, author };
}

export default router;
