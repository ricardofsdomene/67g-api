import Project from "../models/Project";
import slugify from "slugify";

export const create = async (req, res) => {
  try {
    const alreadyExists = await Project.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });

    if (alreadyExists) {
      res.json({
        success: false,
        message: "Infelizmente já existe um projeto com esse nome",
      });
    } else {
      const project = new Project({
        slug: slugify(req.body.name),
        creator: req.userId,
        ...req.body,
      });

      await project.save();

      res.status(201).json({
        success: true,
        message: "Projeto criado com sucesso!",
        data: project,
      });
    }
  } catch (e) {
    return res.status(500).json({ status: "Erro!", error: e });
  }
};

export const get = async (req, res) => {
  try {
    const slug = req.params.slug;
    const project = await Project.findOne({ slug });

    if (!project) {
      return res.json({
        error: true,
        message: "Projeto não encontrado.",
      });
    }

    res.json(project);
  } catch (e) {
    return res.status(500).json({ stauts: "Erro!", erorr: e });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const _id = req.params._id;
    const project = await Project.findOne({ _id });
    res.json(project);
  } catch (e) {
    return res.status(500).json({ stauts: "Erro!", erorr: e });
  }
};

export const update = async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug }).exec();

    console.log(req.body);

    if (project) {
      const alreadyExists = await Project.findOne({
        slug: slugify(req.body.name.toLowerCase()),
      });

      if (alreadyExists) {
        return res.json({
          success: false,
          message: "Infelizmente já existe um projeto com esse nome",
        });
      } else {
        const updated = await Project.findOneAndUpdate({ slug }, req.body, {
          new: true,
        }).exec();

        return res.json(updated);
      }
    } else {
      res.json({ message: "Projeto não encontrado" });
    }
  } catch (e) {
    res.status(500).json({ status: "Erro!", error: e });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;

    await Project.findByIdAndDelete(id).then(() => {
      return res.json({ message: "Projeto deletado com sucesso!" });
    });
  } catch (e) {
    return res.status(400).json({ status: "Erro!", error: e });
  }
};

export const deleteAll = async (req, res) => {
  try {
    await Project.deleteMany().then(() => {
      return res.json({
        message: "Todos os projetos foram deletados com sucesso!",
      });
    });
  } catch (e) {
    return res.status(400).json({ status: "Erro!", error: e });
  }
};
