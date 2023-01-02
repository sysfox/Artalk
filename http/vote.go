package http

import (
	"strings"

	"github.com/ArtalkJS/ArtalkGo/internal/entity"
	"github.com/ArtalkJS/ArtalkGo/internal/query"
	"github.com/labstack/echo/v4"
)

type ParamsVote struct {
	TargetID uint   `mapstructure:"target_id" param:"required"`
	FullType string `mapstructure:"type"`

	Name  string `mapstructure:"name"`
	Email string `mapstructure:"email"`

	SiteName string
	SiteID   uint
	SiteAll  bool
}

func (a *action) Vote(c echo.Context) error {
	var p ParamsVote
	if isOK, resp := ParamsDecode(c, &p); !isOK {
		return resp
	}

	// use site
	UseSite(c, &p.SiteName, &p.SiteID, &p.SiteAll)

	// find user
	var user entity.User
	if p.Name != "" && p.Email != "" {
		user = query.FindCreateUser(p.Name, p.Email, "")
	}

	ip := c.RealIP()

	// check type
	isVoteComment := strings.HasPrefix(p.FullType, "comment_")
	isVotePage := strings.HasPrefix(p.FullType, "page_")
	isUp := strings.HasSuffix(p.FullType, "_up")
	isDown := strings.HasSuffix(p.FullType, "_down")
	voteTo := strings.TrimSuffix(strings.TrimSuffix(p.FullType, "_up"), "_down")
	voteType := strings.TrimPrefix(strings.TrimPrefix(p.FullType, "comment_"), "page_")

	if !isUp && !isDown {
		return RespError(c, "unknown type")
	}

	var comment entity.Comment
	var page entity.Page

	switch {
	case isVoteComment:
		comment = query.FindComment(p.TargetID)
		if comment.IsEmpty() {
			return RespError(c, "comment not found")
		}
	case isVotePage:
		page = query.FindPageByID(p.TargetID)
		if page.IsEmpty() {
			return RespError(c, "page not found")
		}
	default:
		return RespError(c, "unknown type")
	}

	// sync target model field value
	save := func(up int, down int) {
		switch {
		case isVoteComment:
			comment.VoteUp = up
			comment.VoteDown = down
			query.UpdateComment(&comment)
		case isVotePage:
			page.VoteUp = up
			page.VoteDown = down
			query.UpdatePage(&page)
		}
	}

	createNew := func(t string) error {
		// create new vote record
		_, err := query.NewVote(p.TargetID, entity.VoteType(t), user.ID, c.Request().UserAgent(), ip)

		return err
	}

	// un-vote
	var avaliableVotes []entity.Vote
	a.db.Where("target_id = ? AND type LIKE ? AND ip = ?", p.TargetID, voteTo+"%", ip).Find(&avaliableVotes)
	if len(avaliableVotes) > 0 {
		for _, v := range avaliableVotes {
			a.db.Unscoped().Delete(&v)
		}

		avaVoteType := strings.TrimPrefix(strings.TrimPrefix(string(avaliableVotes[0].Type), "comment_"), "page_")
		if voteType != avaVoteType {
			createNew(p.FullType)
		}

		up, down := query.GetVoteNumUpDown(p.TargetID, voteTo)
		save(up, down)

		RecordAction(c)

		return RespData(c, Map{
			"up":   up,
			"down": down,
		})
	}

	createNew(p.FullType)

	// sync
	up, down := query.GetVoteNumUpDown(p.TargetID, voteTo)
	save(up, down)

	RecordAction(c)

	return RespData(c, Map{
		"up":   up,
		"down": down,
	})
}
