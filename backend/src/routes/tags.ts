import { Router, Request, Response } from 'express';
import { TagModel } from '../models';

const router = Router();
const tagModel = new TagModel();

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: List of all tags sorted by usage count
 *       500:
 *         description: Server error
 */
router.get('/', (_req: Request, res: Response): void => {
  try {
    const tags = tagModel.findAll();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

/**
 * @swagger
 * /api/tags/{slug}:
 *   get:
 *     summary: Get tag by slug
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag details
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.get('/:slug', (req: Request, res: Response): void => {
  try {
    const tag = tagModel.findBySlug(req.params.slug);
    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

export default router;
